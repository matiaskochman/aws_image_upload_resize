// backend/src/handlers/getImages.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import s3 from "../utils/s3Client";

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const data = await s3
      .listObjectsV2({
        Bucket: process.env.S3_BUCKET!,
        Prefix: "originals/",
      })
      .promise();

    const images = await Promise.all(
      data.Contents?.map(async (item) => {
        const key = item.Key?.replace(/^originals\//, "");
        if (!key) return null;

        const url = s3.getSignedUrl("getObject", {
          Bucket: process.env.S3_BUCKET!,
          Key: item.Key!, // Usar la clave completa para generar la URL
          Expires: 90,
        });

        return { key, url };
      }) || []
    );

    const body = JSON.stringify({
      images: images.filter(
        (img): img is { key: string; url: string } => !!img
      ),
    });
    const res = {
      statusCode: 200,
      body,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
    return res;
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: "Error fetching images",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
