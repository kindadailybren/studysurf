import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import { Construct } from "constructs";

interface CloudfrontConstructProps {}

export class CloudfrontConstruct extends Construct {
  private distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: CloudfrontConstructProps) {
    super(scope, id);
  }

  // private createCloudfrontDistribution(props: CloudfrontConstructProps) {
  //   this.distribution = new cloudfront.Distribution(
  //     this,
  //     `${props.stage}-Cloudfront-Distribution`,
  //   );
  // }
}
