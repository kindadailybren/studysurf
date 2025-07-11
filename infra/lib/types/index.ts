import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";

export interface BaseConstructProps {
  stage: string;
}

export interface BaseStackProps extends cdk.StackProps {
  stage: string;
}

export interface StatefulStackProps extends BaseStackProps { }

export interface StatelessStackProps extends BaseStackProps { }

export interface GlobalStackProps extends BaseStackProps {
  bucket: s3.Bucket;
}
