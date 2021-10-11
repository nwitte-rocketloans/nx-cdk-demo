import { Construct, StackProps, Stage } from '@aws-cdk/core';
import { ApiStack } from './api-stack';
import { env } from './global-config';

export class AppStage extends Stage {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    new ApiStack(scope, 'ApiStack', {
      stackName: 'nx-cdk-demo-api-stack',
      env,
    });
  }
}
