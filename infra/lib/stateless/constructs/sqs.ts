import * as sqs from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import { Duration } from "aws-cdk-lib";

interface SqsConstructProps {
  stage: string;
}

export class SqsConstruct extends Construct {
  public ingestionDlq: sqs.Queue;
  public ingestionQueue: sqs.Queue;
  public videoRenderDlq: sqs.Queue;
  public videoRenderQueue: sqs.Queue;

  // Backward compatibility alias for cloudwatch construct
  public get sampleDlq(): sqs.Queue {
    return this.ingestionDlq;
  }

  constructor(scope: Construct, id: string, props: SqsConstructProps) {
    super(scope, id);

    this.createQueues(props);
  }

  private createQueues(props: SqsConstructProps) {
    // 1. Ingestion Dead Letter Queue & Queue (PDF Ingestion & AI Summarization)
    this.ingestionDlq = new sqs.Queue(this, `${props.stage}-SQS-Ingestion-DLQ`, {
      queueName: `${props.stage}-SQS-Ingestion-DLQ`,
      retentionPeriod: Duration.days(14),
    });

    this.ingestionQueue = new sqs.Queue(this, `${props.stage}-SQS-Ingestion-Queue`, {
      queueName: `${props.stage}-SQS-Ingestion-Queue`,
      visibilityTimeout: Duration.minutes(5),
      deadLetterQueue: {
        maxReceiveCount: 3,
        queue: this.ingestionDlq,
      },
    });

    // 2. Video Rendering Dead Letter Queue & Queue (MoviePy / FFmpeg Compositing)
    this.videoRenderDlq = new sqs.Queue(this, `${props.stage}-SQS-VideoRender-DLQ`, {
      queueName: `${props.stage}-SQS-VideoRender-DLQ`,
      retentionPeriod: Duration.days(14),
    });

    this.videoRenderQueue = new sqs.Queue(this, `${props.stage}-SQS-VideoRender-Queue`, {
      queueName: `${props.stage}-SQS-VideoRender-Queue`,
      visibilityTimeout: Duration.minutes(15),
      deadLetterQueue: {
        maxReceiveCount: 2,
        queue: this.videoRenderDlq,
      },
    });
  }
}
