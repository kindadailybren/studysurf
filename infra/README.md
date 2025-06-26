# CDK Serverless Template

This is a comprehensive AWS CDK template for building serverless applications. The template is organized into two main stacks: Stateful and Stateless, following AWS best practices for separation of concerns.

## Architecture Overview

### Stateful Stack
The Stateful Stack contains all persistent resources that maintain application state:

- **DynamoDB Construct**: Manages the application's database tables
- **Cognito Construct**: Handles user authentication and authorization
- **S3 Construct**: Manages file storage buckets

### Stateless Stack
The Stateless Stack contains all compute and integration resources:

- **Lambda Construct**: Manages serverless functions
- **API Gateway Construct**: Handles HTTP endpoints and API routing
- **SQS Construct**: Manages message queues for asynchronous processing
- **SNS Construct**: Handles pub/sub messaging and notifications
- **CloudWatch Construct**: Manages monitoring, logging, and alerting

## Key Features

- Infrastructure as Code using AWS CDK
- TypeScript for type safety and better developer experience
- Modular architecture with separate stateful and stateless components
- Built-in monitoring and alerting
- Scalable and maintainable design

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure your AWS credentials

3. Deploy the stacks:
```bash
npm run build
cdk deploy --all
```

## Development

* `npm run build`   compile TypeScript to JavaScript
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

## Stack Details

### Stateful Stack
The Stateful Stack (`lib/stateful/stateful-stack.ts`) manages all persistent resources:

- **DynamoDB**: NoSQL database for application data
- **Cognito**: User authentication and management
- **S3**: File storage and static asset hosting

### Stateless Stack
The Stateless Stack (`lib/stateless/stateless-stack.ts`) manages all compute and integration resources:

- **Lambda**: Serverless functions for business logic
- **API Gateway**: REST API endpoints
- **SQS**: Message queues for async processing
- **SNS**: Pub/sub messaging and notifications
- **CloudWatch**: Monitoring, logging, and alerting

## Security

- IAM roles and policies are automatically configured
- Cognito provides secure user authentication
- S3 buckets are configured with appropriate security settings
- API Gateway includes security features

## Monitoring

The template includes CloudWatch monitoring for:
- Lambda function metrics
- API Gateway performance
- SQS queue metrics
- Error alerts via SNS topics
