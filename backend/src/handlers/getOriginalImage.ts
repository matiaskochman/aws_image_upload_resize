import { APIGatewayProxyHandler } from "aws-lambda";
import s3 from "../utils/s3Client";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const key = event.pathParameters?.key;
    if (!key) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ message: "Missing key" }),
      };
    }

    const url = s3.getSignedUrl("getObject", {
      Bucket: process.env.S3_BUCKET!,
      Key: `originals/${key}`,
      Expires: 90,
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ url }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: "Error generating URL",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
