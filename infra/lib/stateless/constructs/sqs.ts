import * as sqs from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import { Duration } from "aws-cdk-lib";

interface SqsConstructProps {
  stage: string;
}

export class SqsConstruct extends Construct {
  public sampleDlq: sqs.Queue;

  constructor(scope: Construct, id: string, props: SqsConstructProps) {
    super(scope, id);

    this.createQueues(props);
  }

  private createQueues(props: SqsConstructProps) {
    this.sampleDlq = new sqs.Queue(this, `${props.stage}-SQS-Queue-StudySurf`, {
      queueName: `${props.stage}-SQS-Queue-StudySurf`,
      visibilityTimeout: Duration.minutes(15),
    });
  }
}
