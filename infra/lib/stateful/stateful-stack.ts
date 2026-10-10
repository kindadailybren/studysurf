import * as cdk from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import { Construct } from "constructs";
import { StatefulStackProps } from "../types";
import { DynamoDbConstruct } from "./constructs/dynamodb/dynamodb";
import { CognitoConstruct } from "./constructs/cognito";
import { S3Construct } from "./constructs/s3";

export class StatefulStack extends cdk.Stack {
  public dynamoDbConstruct: DynamoDbConstruct;
  public cognitoConstruct: CognitoConstruct;
  public s3Construct: S3Construct;
  public distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: StatefulStackProps) {
    super(scope, id, props);

    this.createDynamoDbConstruct(props);
    this.createCognitoConstruct(props);
    this.createS3Construct(props);
    this.createCloudFrontDistribution(props);
    this.createOutputs(props);
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

  private createCloudFrontDistribution(props: StatefulStackProps): void {
    const mediaOrigin = origins.S3BucketOrigin.withOriginAccessControl(
      this.s3Construct.mediaBucket,
    );

    let certificate: acm.ICertificate | undefined = undefined;
    if (props.certificateArn) {
      certificate = acm.Certificate.fromCertificateArn(
        this,
        `${props.stage}-AcmCertificate`,
        props.certificateArn,
      );
    }

    const domainNames =
      props.domainName && certificate ? [props.domainName] : undefined;

    this.distribution = new cloudfront.Distribution(
      this,
      `${props.stage}-CloudFront-Distribution`,
      {
        domainNames: domainNames,
        certificate: certificate,
        sslSupportMethod: certificate
          ? cloudfront.SSLMethod.SNI
          : undefined,
        minimumProtocolVersion: certificate
          ? cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021
          : undefined,
        defaultBehavior: {
          origin: origins.S3BucketOrigin.withOriginAccessControl(
            this.s3Construct.frontendBucket,
          ),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        additionalBehaviors: {
          "output-videos/*": {
            origin: mediaOrigin,
            viewerProtocolPolicy:
              cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
            cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          },
        },
        defaultRootObject: "index.html",
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
            ttl: cdk.Duration.minutes(0),
          },
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
            ttl: cdk.Duration.minutes(0),
          },
        ],
      },
    );
  }

  private createOutputs(props: StatefulStackProps): void {
    new cdk.CfnOutput(this, "Cognito-UserPool-UserPoolId", {
      value: this.cognitoConstruct.userPool.userPoolId,
      exportName: `${this.stackName}-UserPoolId`,
    });

    new cdk.CfnOutput(this, "Cognito-UserPool-AppClientId", {
      value: this.cognitoConstruct.userPoolClient.userPoolClientId,
      exportName: `${this.stackName}-AppClientId`,
    });

    new cdk.CfnOutput(this, "DynamoDB-Table-TableName", {
      value: this.dynamoDbConstruct.dataDb.tableName,
      exportName: `${this.stackName}-TableName`,
    });

    new cdk.CfnOutput(this, "S3-Bucket-FrontendBucketName", {
      value: this.s3Construct.frontendBucket.bucketName,
      exportName: `${this.stackName}-FrontendBucketName`,
    });

    new cdk.CfnOutput(this, "S3-Bucket-MediaBucketName", {
      value: this.s3Construct.mediaBucket.bucketName,
      exportName: `${this.stackName}-MediaBucketName`,
    });

    new cdk.CfnOutput(this, "CloudFront-Distribution-Id", {
      value: this.distribution.distributionId,
      exportName: `${this.stackName}-DistributionId`,
    });

    new cdk.CfnOutput(this, "CloudFront-Distribution-Domain", {
      value: this.distribution.distributionDomainName,
      exportName: `${this.stackName}-DistributionDomain`,
    });

    if (props.domainName) {
      new cdk.CfnOutput(this, "CloudFront-CustomDomain", {
        value: `https://${props.domainName}`,
        exportName: `${this.stackName}-CustomDomain`,
      });
    }
  }
}
