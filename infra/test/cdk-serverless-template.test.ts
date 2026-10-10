import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { StatefulStack } from "../lib/stateful/stateful-stack";
import DevProps from "../configs/dev";

describe("StatefulStack CloudFront Custom Domain", () => {
  test("configures CloudFront distribution with custom domain and ACM certificate", () => {
    const app = new cdk.App();
    const stack = new StatefulStack(app, "Test-StatefulStack", {
      ...DevProps.Stateful,
      certificateArn: "arn:aws:acm:us-east-1:123456789012:certificate/test-cert",
      domainName: "dev.studysurf.breindel.me",
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties("AWS::CloudFront::Distribution", {
      DistributionConfig: {
        Aliases: ["dev.studysurf.breindel.me"],
        ViewerCertificate: {
          AcmCertificateArn: "arn:aws:acm:us-east-1:123456789012:certificate/test-cert",
          MinimumProtocolVersion: "TLSv1.2_2021",
          SslSupportMethod: "sni-only",
        },
      },
    });
  });

  test("gracefully falls back when certificate ARN is not provided", () => {
    const app = new cdk.App();
    const stack = new StatefulStack(app, "Test-StatefulStack-Fallback", {
      ...DevProps.Stateful,
      certificateArn: undefined,
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties("AWS::CloudFront::Distribution", {
      DistributionConfig: {
        DefaultRootObject: "index.html",
      },
    });
  });
});
