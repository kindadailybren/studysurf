import * as api from "aws-cdk-lib/aws-apigatewayv2";
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Construct } from "constructs";
import { BaseConstructProps } from "../../types";

interface ApiGatewayConstructProps extends BaseConstructProps {
  sampleIntegration: integrations.HttpLambdaIntegration;
}

export class ApiGatewayConstruct extends Construct {
  public api: api.HttpApi;

  constructor(scope: Construct, id: string, props: ApiGatewayConstructProps) {
    super(scope, id);

    this.createApiGateway(props);
    this.createApiRoutes(props);
  }

  private createApiGateway(props: ApiGatewayConstructProps): void {
    this.api = new api.HttpApi(this, `${props.stage}-ApiGateway-HttpApi`, {
      apiName: `${props.stage}-ApiGateway-HttpApi`,
      corsPreflight: {
        allowHeaders: ['content-type', 'Authorization'],
        allowMethods: [api.CorsHttpMethod.GET, api.CorsHttpMethod.POST, api.CorsHttpMethod.OPTIONS],
        allowOrigins: [
          'http://dev-s3-bucket-application-studysurf.s3-website-ap-southeast-1.amazonaws.com',
          'http://staging-s3-bucket-application-studysurf.s3-website-ap-southeast-1.amazonaws.com',
          'https://d3guxtdjraajgf.cloudfront.net',
        ], // Or specify your frontend domain
        allowCredentials: true,
      },
    });
  }

  private createApiRoutes(props: ApiGatewayConstructProps): void {
    this.api.addRoutes({
      path: "/hello",
      methods: [api.HttpMethod.GET],
      integration: props.sampleIntegration,
    });

    this.api.addRoutes({
      path: "/genvid",
      methods: [api.HttpMethod.POST],
      integration: props.sampleIntegration,
    });

    this.api.addRoutes({
      path: "/videos",
      methods: [api.HttpMethod.POST],
      integration: props.sampleIntegration,
    });

    this.api.addRoutes({
      path: "/getUsers",
      methods: [api.HttpMethod.GET],
      integration: props.sampleIntegration,
    });

    this.api.addRoutes({
      path: "/createUser",
      methods: [api.HttpMethod.POST],
      integration: props.sampleIntegration,
    });

    this.api.addRoutes({
      path: "/confirmUser",
      methods: [api.HttpMethod.POST],
      integration: props.sampleIntegration,
    });

    this.api.addRoutes({
      path: "/login",
      methods: [api.HttpMethod.POST],
      integration: props.sampleIntegration,
    });

    this.api.addRoutes({
      path: "/logout",
      methods: [api.HttpMethod.POST],
      integration: props.sampleIntegration,
    });

    this.api.addRoutes({
      path: "/refreshToken",
      methods: [api.HttpMethod.POST],
      integration: props.sampleIntegration,
    });

    this.api.addRoutes({
      path: "/deleteUser",
      methods: [api.HttpMethod.POST],
      integration: props.sampleIntegration,
    });

    this.api.addRoutes({
      path: "/forgetPass",
      methods: [api.HttpMethod.POST],
      integration: props.sampleIntegration,
    });

    this.api.addRoutes({
      path: "/forgetPassConfirm",
      methods: [api.HttpMethod.POST],
      integration: props.sampleIntegration,
    });
  }
}
