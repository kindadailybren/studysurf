import { Duration } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as path from "path";
import { Construct } from "constructs";
import { BaseConstructProps } from "../../types";

interface LambdaConstructProps extends BaseConstructProps { }

export class LambdaConstruct extends Construct {
  public sampleFunction: lambda.Function;
  public sampleIntegration: integrations.HttpLambdaIntegration;

  constructor(scope: Construct, id: string, props: LambdaConstructProps) {
    super(scope, id);

    this.createLambdaFunctions(props);
    this.createLambdaIntegrations(props);
  }

  private createLambdaFunctions(props: LambdaConstructProps) {
    this.sampleFunction = this.createLambdaFunction("sampleFunction", props);
  }

  private createLambdaIntegrations(props: LambdaConstructProps) {
    this.sampleIntegration = new integrations.HttpLambdaIntegration(
      `${props.stage}-LambdaIntegration-sampleIntegration`,
      this.sampleFunction,
    );
  }

  private createLambdaFunction(
    functionName: string,
    props: LambdaConstructProps,
  ) {
    const fn = new lambda.Function(this, `${props.stage}-Lambda-${functionName}`, {
      functionName: `${props.stage}-Lambda-SampleFunction`,
      runtime: lambda.Runtime.PYTHON_3_13,
      handler: "app.handler",
      code: lambda.Code.fromAsset(
        path.resolve(
          __dirname,
          `../../../lambdaFunctions/backend/aws_lambda.zip`,
        ),
      ),
      memorySize: 512,
      timeout: Duration.seconds(30),
    });

    fn.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "bedrock:InvokeModel",
        ],
        resources: [
          "arn:aws:bedrock:ap-southeast-1::foundation-model/anthropic.claude-3-haiku-20240307-v1:0",
        ],
      }),
    );

    fn.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "polly:StartSpeechSynthesisTask",
          "cognito-idp:AdminGetUser",
          "cognito-idp:ListUsers",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
        ],
        resources: ["*"], // optionally scope per service if needed
      }),
    );

    return fn;
  }
}
