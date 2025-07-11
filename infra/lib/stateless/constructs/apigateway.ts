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
        allowHeaders: ['*'],
        allowMethods: [api.CorsHttpMethod.GET, api.CorsHttpMethod.POST, api.CorsHttpMethod.OPTIONS],
        allowOrigins: ['*'], // Or specify your frontend domain
        allowCredentials: false,
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
  }
}
