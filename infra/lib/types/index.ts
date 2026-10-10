import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";

import * as cognito from "aws-cdk-lib/aws-cognito";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export interface BaseConstructProps {
  stage: string;
}

export interface BaseStackProps extends cdk.StackProps {
  stage: string;
}

export interface StatefulStackProps extends BaseStackProps {
  domainName?: string;
  certificateArn?: string;
}

export interface StatelessStackProps extends BaseStackProps {
  userPool: cognito.IUserPool;
  userPoolClient: cognito.IUserPoolClient;
  dataTable: dynamodb.ITable;
  mediaBucket: s3.IBucket;
  cloudFrontDomainName?: string;
  customDomainName?: string;
}

export interface GlobalStackProps extends BaseStackProps {
  bucket: s3.Bucket;
}
