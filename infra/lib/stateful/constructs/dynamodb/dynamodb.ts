import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Data } from "./model";
import { Construct } from "constructs";
import { RemovalPolicy } from "aws-cdk-lib";
import { BaseConstructProps } from "../../../types";

interface DynamoDbConstructProps extends BaseConstructProps {}

export class DynamoDbConstruct extends Construct {
  public dataDb: dynamodb.Table;

  constructor(scope: Construct, id: string, props: DynamoDbConstructProps) {
    super(scope, id);

    this.createDynamoDbTable(props);
  }

  private createDynamoDbTable(props: DynamoDbConstructProps) {
    this.dataDb = new dynamodb.Table(this, Data.TableName, {
      tableName: Data.TableName,
      partitionKey: {
        name: Data.KeyAttributes.PartitionKey.AttributeName,
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: Data.KeyAttributes.SortKey.AttributeName,
        type: dynamodb.AttributeType.STRING,
      },
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy:
        props.stage == "prod" ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
    });

    Data.GlobalSecondaryIndexes.forEach((index) => {
      this.dataDb.addGlobalSecondaryIndex({
        indexName: index.IndexName,
        partitionKey: {
          name: index.KeyAttributes.PartitionKey.AttributeName,
          type: dynamodb.AttributeType.STRING,
        },
        sortKey: index.KeyAttributes.SortKey
          ? {
              name: index.KeyAttributes.SortKey.AttributeName,
              type: dynamodb.AttributeType.STRING,
            }
          : undefined,
        projectionType: dynamodb.ProjectionType.ALL,
      });
    });
  }
}
