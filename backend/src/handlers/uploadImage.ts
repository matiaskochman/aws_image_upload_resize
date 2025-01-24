// backend/src/handlers/uploadImage.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import s3 from "../utils/s3Client";
import { v4 as uuidv4 } from "uuid";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    console.log("Received event:", JSON.stringify(event));

    if (!event.body) {
      console.log("Missing request body");
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing request body" }),
      };
    }

    const body = JSON.parse(event.body);
    const { base64, filename, mimeType } = body;

    console.log("Parsed body:", body);

    if (!base64 || !filename || !mimeType) {
      console.log("Invalid request body");
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid request body" }),
      };
    }

    const buffer = Buffer.from(base64, "base64");
    console.log("Buffer length:", buffer.length);

    const key = `originals/${uuidv4()}/${filename}`;
    console.log("S3 Key:", key);

    await s3
      .putObject({
        Bucket: process.env.S3_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: mimeType, // Usar el tipo MIME enviado desde el frontend
      })
      .promise();

    console.log("Image uploaded successfully");

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Image uploaded successfully", key }),
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error uploading image",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
