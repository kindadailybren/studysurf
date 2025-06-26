import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as sns from "aws-cdk-lib/aws-sns";
import { Construct } from "constructs";
import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions";

interface CloudwatchConstructProps {
  stage: string;
  sampleDlq: sqs.Queue;
  errorAlertTopic: sns.Topic;
}

export class CloudwatchConstruct extends Construct {
  public sampleDlqAlarm: cloudwatch.Alarm;

  constructor(scope: Construct, id: string, props: CloudwatchConstructProps) {
    super(scope, id);

    this.createAlarms(props);
    this.addSnsActions(props);
  }

  private createAlarms(props: CloudwatchConstructProps) {
    this.sampleDlqAlarm = new cloudwatch.Alarm(
      this,
      `${props.stage}-CloudWatch-Alarm-sampleDlqAlarm`,
      {
        alarmName: `${props.stage}-CloudWatch-Alarm-sampleDlqAlarm`,
        metric: props.sampleDlq.metricApproximateNumberOfMessagesVisible(),
        threshold: 0,
        evaluationPeriods: 1,
        comparisonOperator:
          cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      },
    );
  }

  private addSnsActions(props: CloudwatchConstructProps) {
    this.sampleDlqAlarm.addAlarmAction(new SnsAction(props.errorAlertTopic));
    this.sampleDlqAlarm.addOkAction(new SnsAction(props.errorAlertTopic));
  }
}
