import * as sqs from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

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
    this.sampleDlq = new sqs.Queue(this, `${props.stage}-SQS-Queue-sampleDlq`, {
      queueName: `${props.stage}-SQS-Queue-sampleDlq`,
    });
  }
}
