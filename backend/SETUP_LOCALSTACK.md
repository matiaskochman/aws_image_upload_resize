# Setting Up and Running LocalStack

LocalStack is a fully functional local AWS cloud stack. It provides a way to test your AWS applications locally without incurring any costs. This is particularly useful for development and testing purposes, as it allows you to simulate AWS services like S3, DynamoDB, and more.

To set up and run the LocalStack container, follow these steps:

## Run the LocalStack Container

Use the following command to start the LocalStack container:

```sh
docker run -d \
  -p 4566:4566 \
  -e SERVICES=s3 \
  --name localstack \
  localstack/localstack
```

## Check Container Status

Verify that the container is running correctly by executing:

```sh
docker ps
```

## Test LocalStack Health

Ensure that LocalStack is healthy by making a request to the health endpoint:

```sh
curl http://localhost:4566/_localstack/health
```

This setup will allow you to use LocalStack for local development and testing of AWS services, specifically S3 in this case.

## LocalStack Configuration

The LocalStack configuration is already set up in the following files:

- **.env**: Contains environment variables for LocalStack.

  ```sh
  S3_BUCKET=image-resizer-backend-dev-images
  REGION=us-east-1
  LOCALSTACK_ENDPOINT=http://localhost:4566
  ```

- **serverless.yml**: Defines the serverless framework configuration, including LocalStack endpoints.

  ```yaml
  service: image-resizer-backend

  frameworkVersion: "3"

  provider:
    name: aws
    runtime: nodejs16.x
    region: ${env:REGION, 'us-east-1'}
    environment:
      S3_BUCKET: ${env:S3_BUCKET}
      REGION: ${env:REGION}
      LOCALSTACK_ENDPOINT: ${env:LOCALSTACK_ENDPOINT}
    iam:
      role:
        statements:
          - Effect: Allow
            Action:
              - s3:PutObject
              - s3:GetObject
              - s3:ListBucket
            Resource:
              - arn:aws:s3:::${env:S3_BUCKET}
              - arn:aws:s3:::${env:S3_BUCKET}/*

  functions:
    uploadImage:
      handler: dist/handlers/uploadImage.handler
      events:
        - http:
            path: images
            method: post
            cors: true

    getImages:
      handler: dist/handlers/getImages.handler
      events:
        - http:
            path: images
            method: get
            cors: true

    resizeImages:
      handler: dist/handlers/resizeImages.handler # Updated to match the filename
      events:
        - http:
            path: images/{widthxheight}/{object}
            method: get
            cors: true

  plugins:
    - serverless-dotenv-plugin
    - serverless-offline

  package:
    exclude:
      - node_modules/**
      - src/**

  custom:
    dotenv:
      logging: true
      path: .env
    serverless-offline:
      httpPort: 3003
      # Optional: Additional configurations if needed
      # httpsProtocol: false
      # lambdaPort: 3002
  ```

- **tsconfig.json**: TypeScript configuration file.
  ```json
  {
    "compilerOptions": {
      "target": "ES2020",
      "module": "commonjs",
      "lib": ["es2020"],
      "strict": true,
      "esModuleInterop": true,
      "outDir": "dist",
      "rootDir": "src",
      "types": ["node", "aws-lambda"] // Asegúrate de incluir 'aws-lambda'
    },
    "include": ["src"],
    "exclude": ["node_modules", "dist"]
  }
  ```

You can find these files in the `backend` directory.
