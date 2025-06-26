import * as cdk from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { BaseConstructProps } from "../../types";

interface CognitoConstructProps extends BaseConstructProps {}

export class CognitoConstruct extends Construct {
  public userPool: cognito.UserPool;

  constructor(scope: Construct, id: string, props: CognitoConstructProps) {
    super(scope, id);

    this.createUserPool(props);
    this.createUserPoolClient(props);
    this.createUserPoolGroups(props);
  }

  private createUserPool(props: CognitoConstructProps) {
    this.userPool = new cognito.UserPool(
      this,
      `${props.stage}-Cognito-UserPool`,
      {
        userPoolName: `${props.stage}-Cognito-UserPool`,
        selfSignUpEnabled: true,
        signInAliases: {
          email: true,
        },
        customAttributes: {
          role: new cognito.StringAttribute({ mutable: true }),
        },
        passwordPolicy: {
          minLength: 8,
          requireDigits: true,
          requireLowercase: true,
          requireSymbols: false,
          requireUppercase: true,
        },
        deletionProtection: props.stage == "prod" ? true : false,
        removalPolicy:
          props.stage == "prod"
            ? cdk.RemovalPolicy.RETAIN
            : cdk.RemovalPolicy.DESTROY,
      },
    );
  }

  private createUserPoolClient(props: CognitoConstructProps) {
    this.userPool.addClient(`${props.stage}-Cognito-UserPoolClient`, {
      authFlows: {
        adminUserPassword: true,
        userPassword: true,
        custom: true,
      },
      idTokenValidity: cdk.Duration.hours(4),
      accessTokenValidity: cdk.Duration.hours(4),
      refreshTokenValidity: cdk.Duration.days(30),
    });
  }

  private createUserPoolGroups(props: CognitoConstructProps) {
    new cognito.CfnUserPoolGroup(
      this,
      `${props.stage}-Cognito-UserPoolGroup-Users`,
      {
        userPoolId: this.userPool.userPoolId,
        groupName: "users",
      },
    );

    new cognito.CfnUserPoolGroup(
      this,
      `${props.stage}-Cognito-UserPoolGroup-Admin`,
      {
        userPoolId: this.userPool.userPoolId,
        groupName: "admin",
      },
    );
  }
}
