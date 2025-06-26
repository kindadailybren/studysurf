import { Construct } from "constructs";

interface SampleConstructProps {}

export class SampleConstruct extends Construct {
  constructor(scope: Construct, id: string, props: SampleConstructProps) {
    super(scope, id);
  }
}
