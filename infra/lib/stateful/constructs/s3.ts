import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { BaseConstructProps } from "../../types";

interface S3ConstructProps extends BaseConstructProps {}

export class S3Construct extends Construct {
  public bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: S3ConstructProps) {
    super(scope, id);

    this.createBucket(props);
  }

  private createBucket(props: S3ConstructProps): void {
    this.bucket = new s3.Bucket(this, `${props.stage}-S3-Bucket-Application`, {
      bucketName: `${props.stage}-s3-bucket-application`,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });
  }
}
