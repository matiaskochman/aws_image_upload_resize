// src/handlers/resizeImages.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import s3 from "../utils/s3Client";
import sharp from "sharp";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const pathParams = event.pathParameters;

    if (!pathParams) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing path parameters" }),
      };
    }

    const dimensions = pathParams["dimensions"]; // Ejemplo: "600x600"
    const objectKey = pathParams["object"]?.replace(/^\//, ""); // Eliminar cualquier '/' al inicio

    if (!dimensions || !objectKey) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid path parameters" }),
      };
    }

    const [widthStr, heightStr] = dimensions.split("x");
    const width = parseInt(widthStr);
    const height = parseInt(heightStr);

    if (isNaN(width) || isNaN(height)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid width or height" }),
      };
    }

    const resizedKey = `resized/${dimensions}/${objectKey}`; // Almacenar en 'resized/{width}x{height}/image.jpg'

    try {
      // Verificar si la imagen redimensionada ya existe
      await s3
        .headObject({
          Bucket: process.env.S3_BUCKET!,
          Key: resizedKey,
        })
        .promise();

      // Si existe, generar una URL firmada
      const url = s3.getSignedUrl("getObject", {
        Bucket: process.env.S3_BUCKET!,
        Key: resizedKey,
        Expires: 300, // URL válida por 5 minutos
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ url }),
      };
    } catch (err: any) {
      if (err.code !== "NotFound" && err.statusCode !== 404) {
        throw err; // Error diferente a objeto no encontrado
      }

      // Obtener la imagen original
      const originalKey = `originals/${objectKey}`;
      const originalImage = await s3
        .getObject({
          Bucket: process.env.S3_BUCKET!,
          Key: originalKey,
        })
        .promise();

      if (!originalImage.Body) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "Original image not found" }),
        };
      }

      // Redimensionar la imagen usando Sharp
      const resizedImageBuffer = await sharp(originalImage.Body as Buffer)
        .resize(width, height)
        .toBuffer();

      // Obtener el tipo de contenido original
      const contentType = originalImage.ContentType || "image/jpeg";

      // Almacenar la imagen redimensionada en S3
      await s3
        .putObject({
          Bucket: process.env.S3_BUCKET!,
          Key: resizedKey,
          Body: resizedImageBuffer,
          ContentType: contentType, // Mantener el tipo de contenido original
        })
        .promise();

      // Generar una URL firmada para la imagen redimensionada
      const resizedUrl = s3.getSignedUrl("getObject", {
        Bucket: process.env.S3_BUCKET!,
        Key: resizedKey,
        Expires: 300, // URL válida por 5 minutos
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ url: resizedUrl }),
      };
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error processing image resizing",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
