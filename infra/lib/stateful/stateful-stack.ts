import * as cdk from "aws-cdk-lib";

import { Construct } from "constructs";
import { StatefulStackProps } from "../types";
import { DynamoDbConstruct } from "./constructs/dynamodb/dynamodb";
import { CognitoConstruct } from "./constructs/cognito";
import { S3Construct } from "./constructs/s3";

export class StatefulStack extends cdk.Stack {
  public dynamoDbConstruct: DynamoDbConstruct;
  public cognitoConstruct: CognitoConstruct;
  private s3Construct: S3Construct;

  constructor(scope: Construct, id: string, props: StatefulStackProps) {
    super(scope, id, props);

    this.createDynamoDbConstruct(props);
    this.createCognitoConstruct(props);
    this.createS3Construct(props);
    this.createOutputs();
  }

  private createDynamoDbConstruct(props: StatefulStackProps): void {
    this.dynamoDbConstruct = new DynamoDbConstruct(
      this,
      `${props.stage}-DynamoDB-Construct`,
      {
        stage: props.stage,
      },
    );
  }

  private createCognitoConstruct(props: StatefulStackProps): void {
    this.cognitoConstruct = new CognitoConstruct(
      this,
      `${props.stage}-Cognito-Construct`,
      {
        stage: props.stage,
      },
    );
  }

  private createS3Construct(props: StatefulStackProps): void {
    this.s3Construct = new S3Construct(this, `${props.stage}-S3-Construct`, {
      stage: props.stage,
    });
  }

  private createOutputs(): void {
    new cdk.CfnOutput(this, "Cognito-UserPool-UserPoolId", {
      value: this.cognitoConstruct.userPool.userPoolId,
    });

    new cdk.CfnOutput(this, "DynamoDB-Table-TableName", {
      value: this.dynamoDbConstruct.dataDb.tableName,
    });

    new cdk.CfnOutput(this, "S3-Bucket-BucketName", {
      value: this.s3Construct.bucket.bucketName,
    });
  }
}
