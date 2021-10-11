import * as cdk from '@aws-cdk/core';
import { AppStack } from './stacks/app-stack';
import { env } from './stacks/global-config';

const app = new cdk.App();
new AppStack(app, 'cdk-pipeline', { env });
