import { Construct, StackProps, Stage } from '@aws-cdk/core';
import { ApiStack } from './api-stack';

export class AppStage extends Stage {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    new ApiStack(this, 'ApiStack', {
      stackName: 'nx-cdk-demo-api-stack',
      ...props,
    });
  }
}
