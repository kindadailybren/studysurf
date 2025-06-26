import * as cdk from "aws-cdk-lib";

import { Construct } from "constructs";
import { LambdaConstruct } from "./constructs/lambda";
import { SqsConstruct } from "./constructs/sqs";
import { SnsConstruct } from "./constructs/sns";
import { ApiGatewayConstruct } from "./constructs/apigateway";
import { CloudwatchConstruct } from "./constructs/cloudwatch";
import { StatelessStackProps } from "../types";

export class StatelessStack extends cdk.Stack {
  private sqsConstruct: SqsConstruct;
  private snsConstruct: SnsConstruct;
  private apiGatewayConstruct: ApiGatewayConstruct;
  private lambdaConstruct: LambdaConstruct;
  private cloudWatchConstruct: CloudwatchConstruct;

  constructor(scope: Construct, id: string, props: StatelessStackProps) {
    super(scope, id, props);

    this.createLambdaConstruct(props);
    this.createApiGatewayConstruct(props);
    this.createSqsConstruct(props);
    this.createSnsConstruct(props);
    this.createCloudWatchConstruct(props);
  }

  private createApiGatewayConstruct(props: StatelessStackProps): void {
    this.apiGatewayConstruct = new ApiGatewayConstruct(
      this,
      `${props.stage}-ApiGateway-Construct`,
      {
        stage: props.stage,
        sampleIntegration: this.lambdaConstruct.sampleIntegration,
      },
    );
  }

  private createSqsConstruct(props: StatelessStackProps): void {
    this.sqsConstruct = new SqsConstruct(this, `${props.stage}-SQS-Construct`, {
      stage: props.stage,
    });
  }

  private createSnsConstruct(props: StatelessStackProps) {
    this.snsConstruct = new SnsConstruct(this, `${props.stage}-SNS-Construct`, {
      stage: props.stage,
    });
  }

  private createLambdaConstruct(props: StatelessStackProps): void {
    this.lambdaConstruct = new LambdaConstruct(
      this,
      `${props.stage}-Lambda-Construct`,
      {
        stage: props.stage,
      },
    );
  }

  private createCloudWatchConstruct(props: StatelessStackProps): void {
    this.cloudWatchConstruct = new CloudwatchConstruct(
      this,
      `${props.stage}-CloudWatch-Construct`,
      {
        stage: props.stage,
        sampleDlq: this.sqsConstruct.sampleDlq,
        errorAlertTopic: this.snsConstruct.errorAlertTopic,
      },
    );
  }
}
