import { Stack, Construct, StackProps, SecretValue } from '@aws-cdk/core';
import {
  CodePipeline,
  ShellStep,
  CodePipelineSource,
} from '@aws-cdk/pipelines';
import path = require('path');
import { AppStage } from './app-stage';
import { env } from './global-config';

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const authentication = SecretValue.secretsManager('GITHUB_SECRET_PAT');

    const input = CodePipelineSource.gitHub(
      'nwitte-rocketloans/nx-cdk-demo',
      'feature/upgrade-cdk',
      { authentication }
    );

    const synth = new ShellStep('Synth', {
      input,
      commands: [
        'yarn install --frozen-lockfile',
        'yarn nx run cdk-pipeline:build',
        'yarn nx run cdk-pipeline:synth',
      ],
      primaryOutputDirectory: 'dist/apps/cdk-pipeline/cdk.out',
    });

    const pipeline = new CodePipeline(this, 'CodePipeline', {
      synth,
      selfMutation: true,
      pipelineName: 'nx-cdk-demo-pipeline',
    });

    const stage = new AppStage(this, 'AppStage', { env });

    pipeline.addStage(stage);
  }
}
