import * as cdk from "aws-cdk-lib";

export interface BaseConstructProps {
  stage: string;
}

export interface BaseStackProps extends cdk.StackProps {
  stage: string;
}

export interface StatefulStackProps extends BaseStackProps {}
export interface StatelessStackProps extends BaseStackProps {}
export interface GlobalStackProps extends BaseStackProps {}
