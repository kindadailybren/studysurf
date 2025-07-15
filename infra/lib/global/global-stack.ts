import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { CloudFrontConstruct } from "./constructs/cloudfront";
import { GlobalStackProps } from "../types"

export class GlobalStack extends cdk.Stack {
  private cloudFrontConstruct: CloudFrontConstruct;

  constructor(scope: Construct, id: string, props: GlobalStackProps) {
    super(scope, id, props);

    this.createCloudFrontConstruct(props);
  }

  private createCloudFrontConstruct(props: GlobalStackProps): void {
    this.cloudFrontConstruct = new CloudFrontConstruct(
      this,
      `${props.stage}-CloudFront-Construct`,
      {
        stage: props.stage,
        bucket: props.bucket,
      },
    );
  }
}
