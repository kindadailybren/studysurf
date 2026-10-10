import { Duration, Size } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import * as iam from "aws-cdk-lib/aws-iam";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as path from "path";
import * as fs from "fs";
import { Construct } from "constructs";
import { BaseConstructProps } from "../../types";

export interface LambdaConstructProps extends BaseConstructProps {
  dataTable: dynamodb.ITable;
  mediaBucket: s3.IBucket;
  userPool: cognito.IUserPool;
  userPoolClient: cognito.IUserPoolClient;
  ingestionQueue: sqs.IQueue;
  videoRenderQueue: sqs.IQueue;
  cloudFrontDomainName?: string;
  customDomainName?: string;
}

export class LambdaConstruct extends Construct {
  public apiFunction: lambda.Function;
  public stage1WorkerFunction: lambda.Function;
  public stage2WorkerFunction: lambda.Function;
  public sampleIntegration: integrations.HttpLambdaIntegration;
  public pollyRule: events.Rule;

  // Backward compatibility alias
  public get sampleFunction(): lambda.Function {
    return this.apiFunction;
  }

  constructor(scope: Construct, id: string, props: LambdaConstructProps) {
    super(scope, id);

    this.createApiFunction(props);
    this.createStage1Worker(props);
    this.createPollyEventBridgeRule(props);
    this.createStage2Worker(props);
  }

  private getBackendCode(): lambda.AssetCode {
    const zipPath = path.resolve(
      __dirname,
      "../../../lambdaFunctions/backend/aws_lambda.zip",
    );
    if (fs.existsSync(zipPath)) {
      return lambda.Code.fromAsset(zipPath);
    }
    return lambda.Code.fromAsset(
      path.resolve(__dirname, "../../../lambdaFunctions/backend"),
      {
        exclude: ["*.mp4", "media/*.mp4", "__pycache__", "lib", ".venv", "tests"],
      },
    );
  }

  private createApiFunction(props: LambdaConstructProps): void {
    this.apiFunction = new lambda.Function(
      this,
      `${props.stage}-Lambda-Api`,
      {
        functionName: `${props.stage}-Lambda-StudySurf-Api`,
        runtime: lambda.Runtime.PYTHON_3_13,
        handler: "app.handler",
        code: this.getBackendCode(),
        memorySize: 1024,
        timeout: Duration.seconds(30),
        environment: {
          TABLE_NAME: props.dataTable.tableName,
          MEDIA_BUCKET_NAME: props.mediaBucket.bucketName,
          INGESTION_QUEUE_URL: props.ingestionQueue.queueUrl,
          USER_POOL_ID: props.userPool.userPoolId,
          APP_CLIENT_ID: props.userPoolClient.userPoolClientId,
          CLOUDFRONT_DOMAIN: props.customDomainName || props.cloudFrontDomainName || "",
          FRONTEND_URL: props.customDomainName
            ? `https://${props.customDomainName}`
            : props.cloudFrontDomainName
            ? `https://${props.cloudFrontDomainName}`
            : "",
          STAGE: props.stage,
        },
      },
    );

    // Grant least-privilege permissions
    props.dataTable.grantReadWriteData(this.apiFunction);
    props.mediaBucket.grantReadWrite(this.apiFunction);
    props.ingestionQueue.grantSendMessages(this.apiFunction);

    this.apiFunction.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "cognito-idp:AdminGetUser",
          "cognito-idp:ListUsers",
          "cognito-idp:AdminDeleteUser",
          "cognito-idp:DeleteUser",
          "cognito-idp:SignUp",
          "cognito-idp:ConfirmSignUp",
          "cognito-idp:InitiateAuth",
          "cognito-idp:GlobalSignOut",
          "cognito-idp:ForgotPassword",
          "cognito-idp:ConfirmForgotPassword",
        ],
        resources: [props.userPool.userPoolArn],
      }),
    );

    this.sampleIntegration = new integrations.HttpLambdaIntegration(
      `${props.stage}-LambdaIntegration-Api`,
      this.apiFunction,
    );
  }

  private createStage1Worker(props: LambdaConstructProps): void {
    this.stage1WorkerFunction = new lambda.Function(
      this,
      `${props.stage}-Lambda-Stage1Worker`,
      {
        functionName: `${props.stage}-Lambda-StudySurf-Stage1Worker`,
        runtime: lambda.Runtime.PYTHON_3_13,
        handler: "stage1_worker.handler",
        code: this.getBackendCode(),
        memorySize: 1536,
        timeout: Duration.minutes(5),
        environment: {
          TABLE_NAME: props.dataTable.tableName,
          MEDIA_BUCKET_NAME: props.mediaBucket.bucketName,
          VIDEO_RENDER_QUEUE_URL: props.videoRenderQueue.queueUrl,
          STAGE: props.stage,
        },
      },
    );

    // SQS Event Trigger
    this.stage1WorkerFunction.addEventSource(
      new lambdaEventSources.SqsEventSource(props.ingestionQueue, {
        batchSize: 1,
        maxConcurrency: 5,
      }),
    );

    // Permissions
    props.dataTable.grantReadWriteData(this.stage1WorkerFunction);
    props.mediaBucket.grantReadWrite(this.stage1WorkerFunction);
    props.videoRenderQueue.grantSendMessages(this.stage1WorkerFunction);

    this.stage1WorkerFunction.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["bedrock:InvokeModel"],
        resources: [
          "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-haiku-20240307-v1:0",
        ],
      }),
    );

    this.stage1WorkerFunction.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "polly:StartSpeechSynthesisTask",
          "polly:SynthesizeSpeech",
          "polly:GetSpeechSynthesisTask",
        ],
        resources: ["*"],
      }),
    );
  }

  private createPollyEventBridgeRule(props: LambdaConstructProps): void {
    this.pollyRule = new events.Rule(this, `${props.stage}-Polly-TaskCompleted-Rule`, {
      ruleName: `${props.stage}-StudySurf-Polly-Completed`,
      description: "Captures Amazon Polly speech synthesis completion and sends to Video Render SQS",
      eventPattern: {
        source: ["aws.polly"],
        detailType: ["Polly Speech Synthesis Task Completed"],
      },
    });

    this.pollyRule.addTarget(new targets.SqsQueue(props.videoRenderQueue));
  }

  private createStage2Worker(props: LambdaConstructProps): void {
    this.stage2WorkerFunction = new lambda.Function(
      this,
      `${props.stage}-Lambda-Stage2Worker`,
      {
        functionName: `${props.stage}-Lambda-StudySurf-Stage2Worker`,
        runtime: lambda.Runtime.PYTHON_3_13,
        handler: "stage2_worker.handler",
        code: this.getBackendCode(),
        memorySize: 3008,
        ephemeralStorageSize: Size.mebibytes(2048),
        timeout: Duration.minutes(15),
        environment: {
          TABLE_NAME: props.dataTable.tableName,
          MEDIA_BUCKET_NAME: props.mediaBucket.bucketName,
          CLOUDFRONT_DOMAIN: props.customDomainName || props.cloudFrontDomainName || "",
          STAGE: props.stage,
        },
      },
    );

    // SQS Event Trigger
    this.stage2WorkerFunction.addEventSource(
      new lambdaEventSources.SqsEventSource(props.videoRenderQueue, {
        batchSize: 1,
        maxConcurrency: 2,
      }),
    );

    // Permissions
    props.dataTable.grantReadWriteData(this.stage2WorkerFunction);
    props.mediaBucket.grantReadWrite(this.stage2WorkerFunction);
  }
}
