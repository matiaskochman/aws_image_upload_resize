import AWS from "aws-sdk";

const isLocal = process.env.LOCALSTACK_ENDPOINT ? true : false;

const s3 = new AWS.S3(
  isLocal
    ? {
        endpoint: process.env.LOCALSTACK_ENDPOINT,
        s3ForcePathStyle: true,
        accessKeyId: "test", // Credenciales dummy para LocalStack
        secretAccessKey: "test",
        region: process.env.REGION || "us-east-1",
      }
    : {
        region: process.env.REGION,
      }
);

export default s3;
