import * as api from "aws-cdk-lib/aws-apigatewayv2";
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as authorizers from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { BaseConstructProps } from "../../types";

interface ApiGatewayConstructProps extends BaseConstructProps {
  sampleIntegration: integrations.HttpLambdaIntegration;
  userPool: cognito.IUserPool;
  userPoolClient: cognito.IUserPoolClient;
  cloudFrontDomainName?: string;
  customDomainName?: string;
}

export class ApiGatewayConstruct extends Construct {
  public api: api.HttpApi;
  public authorizer: authorizers.HttpUserPoolAuthorizer;

  constructor(scope: Construct, id: string, props: ApiGatewayConstructProps) {
    super(scope, id);

    this.createAuthorizer(props);
    this.createApiGateway(props);
    this.createApiRoutes(props);
  }

  private createAuthorizer(props: ApiGatewayConstructProps): void {
    this.authorizer = new authorizers.HttpUserPoolAuthorizer(
      `${props.stage}-HttpApi-UserPoolAuthorizer`,
      props.userPool,
      {
        userPoolClients: [props.userPoolClient],
        identitySource: ["$request.header.Authorization"],
      },
    );
  }

  private createApiGateway(props: ApiGatewayConstructProps): void {
    const rawAllowedOrigins = [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3000",
    ];

    if (props.cloudFrontDomainName) {
      rawAllowedOrigins.push(`https://${props.cloudFrontDomainName}`);
    }

    if (props.customDomainName) {
      rawAllowedOrigins.push(`https://${props.customDomainName}`);
    }

    const allowedOrigins = Array.from(new Set(rawAllowedOrigins));

    this.api = new api.HttpApi(this, `${props.stage}-ApiGateway-HttpApi`, {
      apiName: `${props.stage}-ApiGateway-HttpApi`,
      corsPreflight: {
        allowHeaders: [
          "Content-Type",
          "Authorization",
          "Accept",
          "X-Requested-With",
        ],
        allowMethods: [
          api.CorsHttpMethod.GET,
          api.CorsHttpMethod.POST,
          api.CorsHttpMethod.PUT,
          api.CorsHttpMethod.DELETE,
          api.CorsHttpMethod.OPTIONS,
        ],
        allowOrigins: allowedOrigins,
        allowCredentials: true,
      },
    });
  }

  private createApiRoutes(props: ApiGatewayConstructProps): void {
    // Public Health Check
    this.api.addRoutes({
      path: "/hello",
      methods: [api.HttpMethod.GET],
      integration: props.sampleIntegration,
    });

    // Public Auth Endpoints
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
      path: "/forgetPass",
      methods: [api.HttpMethod.POST],
      integration: props.sampleIntegration,
    });

    this.api.addRoutes({
      path: "/forgetPassConfirm",
      methods: [api.HttpMethod.POST],
      integration: props.sampleIntegration,
    });

    // Protected Routes (Secured with Cognito JWT Authorizer)
    this.api.addRoutes({
      path: "/jobs/upload-url",
      methods: [api.HttpMethod.POST],
      integration: props.sampleIntegration,
      authorizer: this.authorizer,
    });

    this.api.addRoutes({
      path: "/jobs",
      methods: [api.HttpMethod.POST, api.HttpMethod.GET],
      integration: props.sampleIntegration,
      authorizer: this.authorizer,
    });

    this.api.addRoutes({
      path: "/jobs/{id}",
      methods: [api.HttpMethod.GET, api.HttpMethod.DELETE],
      integration: props.sampleIntegration,
      authorizer: this.authorizer,
    });

    this.api.addRoutes({
      path: "/videos",
      methods: [api.HttpMethod.GET, api.HttpMethod.POST],
      integration: props.sampleIntegration,
      authorizer: this.authorizer,
    });

    this.api.addRoutes({
      path: "/videos/{id}",
      methods: [api.HttpMethod.PUT, api.HttpMethod.DELETE],
      integration: props.sampleIntegration,
      authorizer: this.authorizer,
    });

    this.api.addRoutes({
      path: "/deleteUser",
      methods: [api.HttpMethod.POST],
      integration: props.sampleIntegration,
      authorizer: this.authorizer,
    });

    // Legacy genvid (supported during migration, secured)
    this.api.addRoutes({
      path: "/genvid",
      methods: [api.HttpMethod.POST],
      integration: props.sampleIntegration,
      authorizer: this.authorizer,
    });
  }
}
