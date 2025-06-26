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
  },
);

const prodStatefulStack = new StatefulStack(
  app,
  `${ProdProps.Stateful.stage}-StatefulStack`,
  {
    ...DevProps.Stateful,
  },
);

const prodStatelessStack = new StatelessStack(
  app,

  `${ProdProps.Stateless.stage}-StatelessStack`,
  {
    ...ProdProps.Stateless,
  },
);
