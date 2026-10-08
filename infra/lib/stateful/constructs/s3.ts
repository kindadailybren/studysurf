import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { BaseConstructProps } from "../../types";

interface S3ConstructProps extends BaseConstructProps { }

export class S3Construct extends Construct {
  public frontendBucket: s3.Bucket;
  public mediaBucket: s3.Bucket;

  // Backward compatibility getter/alias
  public get bucket(): s3.Bucket {
    return this.frontendBucket;
  }

  constructor(scope: Construct, id: string, props: S3ConstructProps) {
    super(scope, id);

    this.createFrontendBucket(props);
    this.createMediaBucket(props);
  }

  private createFrontendBucket(props: S3ConstructProps): void {
    this.frontendBucket = new s3.Bucket(this, `${props.stage}-S3-Bucket-Application`, {
      bucketName: `${props.stage}-s3-bucket-application-studysurf-${cdk.Aws.ACCOUNT_ID}`,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy:
        props.stage === "prod" ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: props.stage !== "prod",
    });
  }

  private createMediaBucket(props: S3ConstructProps): void {
    this.mediaBucket = new s3.Bucket(this, `${props.stage}-S3-Bucket-Media`, {
      bucketName: `${props.stage}-studysurf-media-${cdk.Aws.ACCOUNT_ID}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
            s3.HttpMethods.HEAD,
          ],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
          exposedHeaders: ["ETag"],
          maxAge: 3000,
        },
      ],
      lifecycleRules: [
        {
          id: "expire-temp-uploads",
          prefix: "uploads/",
          expiration: cdk.Duration.days(7),
        },
        {
          id: "expire-temp-audio",
          prefix: "audio/",
          expiration: cdk.Duration.days(30),
        },
      ],
      removalPolicy:
        props.stage === "prod" ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: props.stage !== "prod",
    });
  }
}
