# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the StudySurf project, organized by component.

## Workflows

### 1. `deploy.yml` - Main Orchestrator
- Detects changes in different directories
- Triggers appropriate component workflows
- Runs on pushes to `main` and pull requests

### 2. `backend-deploy.yml` - Backend Pipeline
- **Triggers**: Changes in `backend/` directory
- **Actions**:
  - Lints Python code with flake8
  - Checks code formatting with black
  - Validates import sorting with isort
  - Packages and deploys to AWS Lambda
  - Runs CDK deploy if infrastructure changes are needed

### 3. `frontend-deploy.yml` - Frontend Pipeline
- **Triggers**: Changes in `frontend/` directory
- **Actions**:
  - Lints TypeScript/React code with ESLint
  - Performs type checking with TypeScript
  - Builds the application with Vite
  - Deploys to S3
  - Invalidates CloudFront cache

### AWS Credentials
- `AWS_ACCESS_KEY_ID` - AWS access key for deployment
- `AWS_SECRET_ACCESS_KEY` - AWS secret key for deployment
- `AWS_REGION` - AWS region (e.g., us-east-1)

### Frontend Deployment
- `S3_BUCKET_NAME` - S3 bucket name for frontend hosting
- `CLOUDFRONT_DISTRIBUTION_ID` - CloudFront distribution ID for cache invalidation

## Setup Instructions

1. **Configure AWS Credentials**:
   - Create an IAM user with appropriate permissions for Lambda, S3, CloudFront, and CDK
   - Add the credentials as GitHub secrets

2. **Update Resource Names**:
   - In `backend-deploy.yml`: Update Lambda function name (`studysurf-backend`)
   - In `frontend-deploy.yml`: Verify S3 bucket and CloudFront distribution references
   - In `infra-deploy.yml`: Adjust CloudFormation stack name filters if needed

3. **Environment Variables**:
   - Add any required environment variables for your frontend build in `frontend-deploy.yml`
   - Configure backend environment variables in your Lambda function or CDK

## Workflow Behavior

- **Pull Requests**: Run linting, testing, and validation only
- **Main Branch**: Run full deployment pipeline after successful validation
- **Path-based Triggers**: Only affected components are built and deployed
- **Error Handling**: Workflows fail fast on linting or build errors

## Local Development

To run similar checks locally:

### Backend
```bash
cd backend
pip install flake8 black isort
flake8 .
black --check .
isort --check-only .
```

### Frontend
```bash
cd frontend
npm run lint
npx tsc --noEmit
npm run build
```

### Infrastructure
```bash
cd infra
npm run build
npm test
npx cdk synth
npx cdk diff
```

## Troubleshooting

- **Lambda deployment fails**: Check function name and IAM permissions
- **S3 sync fails**: Verify bucket name and S3 permissions
- **CloudFront invalidation fails**: Check distribution ID and CloudFront permissions
- **CDK deployment fails**: Ensure CDK is bootstrapped and IAM permissions are sufficient
