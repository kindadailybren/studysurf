import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import { Construct } from "constructs";

interface CloudFrontConstructProps {
  stage: string;
  bucket: s3.Bucket;
}

export class CloudFrontConstruct extends Construct {
  private distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: CloudFrontConstructProps) {
    super(scope, id);

    this.createCloudfrontDistribution(props);
  }

  private createCloudfrontDistribution(props: CloudFrontConstructProps) {
    this.distribution = new cloudfront.Distribution(
      this,
      `${props.stage}-Cloudfront-Distribution`,
      {
        defaultBehavior: {
          origin: new origins.S3StaticWebsiteOrigin(props.bucket),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        defaultRootObject: "index.html",
      },
    );
  }
}
