export const Data = {
  TableName: "Data",
  KeyAttributes: {
    PartitionKey: {
      AttributeName: "PK",
      AttributeType: "S",
    },
    SortKey: {
      AttributeName: "SK",
      AttributeType: "S",
    },
  },
  NonKeyAttributes: [
    {
      AttributeName: "type",
      AttributeType: "S",
    },
    {
      AttributeName: "PK1",
      AttributeType: "S",
    },
    {
      AttributeName: "SK1",
      AttributeType: "S",
    },
    {
      AttributeName: "PK2",
      AttributeType: "S",
    },
    {
      AttributeName: "SK2",
      AttributeType: "S",
    },
    {
      AttributeName: "PK3",
      AttributeType: "S",
    },
    {
      AttributeName: "SK3",
      AttributeType: "S",
    },
    {
      AttributeName: "PK4",
      AttributeType: "S",
    },
    {
      AttributeName: "SK4",
      AttributeType: "S",
    },
    {
      AttributeName: "PK5",
      AttributeType: "S",
    },
    {
      AttributeName: "SK5",
      AttributeType: "S",
    },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: "GSI1",
      KeyAttributes: {
        PartitionKey: {
          AttributeName: "PK1",
          AttributeType: "S",
        },
        SortKey: {
          AttributeName: "SK1",
          AttributeType: "S",
        },
      },
      Projection: {
        ProjectionType: "ALL",
      },
    },
    {
      IndexName: "GSI2",
      KeyAttributes: {
        PartitionKey: {
          AttributeName: "PK2",
          AttributeType: "S",
        },
        SortKey: {
          AttributeName: "SK2",
          AttributeType: "S",
        },
      },
      Projection: {
        ProjectionType: "ALL",
      },
    },
    {
      IndexName: "GSI3",
      KeyAttributes: {
        PartitionKey: {
          AttributeName: "PK3",
          AttributeType: "S",
        },
        SortKey: {
          AttributeName: "SK3",
          AttributeType: "S",
        },
      },
      Projection: {
        ProjectionType: "ALL",
      },
    },
    {
      IndexName: "GSI4",
      KeyAttributes: {
        PartitionKey: {
          AttributeName: "PK4",
          AttributeType: "S",
        },
        SortKey: {
          AttributeName: "SK4",
          AttributeType: "S",
        },
      },
      Projection: {
        ProjectionType: "ALL",
      },
    },
    {
      IndexName: "GSI5",
      KeyAttributes: {
        PartitionKey: {
          AttributeName: "PK5",
          AttributeType: "S",
        },
        SortKey: {
          AttributeName: "SK5",
          AttributeType: "S",
        },
      },
      Projection: {
        ProjectionType: "ALL",
      },
    },
  ],
};
