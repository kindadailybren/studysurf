#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { StatelessStack } from "../lib/stateless/stateless-stack";
import { StatefulStack } from "../lib/stateful/stateful-stack";
import DevProps from "../configs/dev";
import StagingProps from "../configs/staging";
import ProdProps from "../configs/prod";

const app = new cdk.App();

const devStatefulStack = new StatefulStack(
  app,
  `${DevProps.Stateful.stage}-StatefulStack`,
  {
    ...DevProps.Stateful,
  },
);

const devStatelessStack = new StatelessStack(
  app,
  `${DevProps.Stateless.stage}-StatelessStack`,
  {
    ...DevProps.Stateless,
    userPool: devStatefulStack.cognitoConstruct.userPool,
    userPoolClient: devStatefulStack.cognitoConstruct.userPoolClient,
    dataTable: devStatefulStack.dynamoDbConstruct.dataDb,
    mediaBucket: devStatefulStack.s3Construct.mediaBucket,
    cloudFrontDomainName: devStatefulStack.distribution.distributionDomainName,
  },
);

const stagingStatefulStack = new StatefulStack(
  app,
  `${StagingProps.Stateful.stage}-StatefulStack`,
  {
    ...StagingProps.Stateful,
  },
);

const stagingStatelessStack = new StatelessStack(
  app,
  `${StagingProps.Stateless.stage}-StatelessStack`,
  {
    ...StagingProps.Stateless,
    userPool: stagingStatefulStack.cognitoConstruct.userPool,
    userPoolClient: stagingStatefulStack.cognitoConstruct.userPoolClient,
    dataTable: stagingStatefulStack.dynamoDbConstruct.dataDb,
    mediaBucket: stagingStatefulStack.s3Construct.mediaBucket,
    cloudFrontDomainName: stagingStatefulStack.distribution.distributionDomainName,
  },
);

const prodStatefulStack = new StatefulStack(
  app,
  `${ProdProps.Stateful.stage}-StatefulStack`,
  {
    ...ProdProps.Stateful,
  },
);

const prodStatelessStack = new StatelessStack(
  app,
  `${ProdProps.Stateless.stage}-StatelessStack`,
  {
    ...ProdProps.Stateless,
    userPool: prodStatefulStack.cognitoConstruct.userPool,
    userPoolClient: prodStatefulStack.cognitoConstruct.userPoolClient,
    dataTable: prodStatefulStack.dynamoDbConstruct.dataDb,
    mediaBucket: prodStatefulStack.s3Construct.mediaBucket,
    cloudFrontDomainName: prodStatefulStack.distribution.distributionDomainName,
  },
);
