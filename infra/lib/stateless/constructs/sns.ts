import * as sns from "aws-cdk-lib/aws-sns";
import { Construct } from "constructs";

interface SnsConstructProps {
  stage: string;
}

export class SnsConstruct extends Construct {
  public sampleTopic: sns.Topic;
  public errorAlertTopic: sns.Topic;

  constructor(scope: Construct, id: string, props: SnsConstructProps) {
    super(scope, id);

    this.createSnsTopics(props);
  }

  private createSnsTopics(props: SnsConstructProps) {
    this.sampleTopic = this.createTopic(props, "SampleTopic");
    this.errorAlertTopic = this.createTopic(props, "ErrorAlertTopic");
  }

  private createTopic(props: SnsConstructProps, topicName: string) {
    return new sns.Topic(this, `${props.stage}-SNS-Topic-${topicName}`, {
      topicName,
    });
  }
}
