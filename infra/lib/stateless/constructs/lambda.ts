import { Duration } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
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
    return new lambda.Function(this, `${props.stage}-Lambda-${functionName}`, {
      functionName: `${props.stage}-Lambda-SampleFunction`,
      runtime: lambda.Runtime.PYTHON_3_13,
      handler: "app.handler",
      code: lambda.Code.fromAsset(
        path.resolve(
          __dirname,
          `../../../../backend/aws_lambda.zip`,
        ),
      ),
      memorySize: 512,
      timeout: Duration.seconds(30),
    });
  }
}
