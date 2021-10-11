import { Stack, Construct, StackProps, SecretValue } from '@aws-cdk/core';
import { Artifact } from '@aws-cdk/aws-codepipeline';
import { GitHubSourceAction } from '@aws-cdk/aws-codepipeline-actions';
import { CdkPipeline, SimpleSynthAction } from '@aws-cdk/pipelines';
import { LinuxBuildImage, ComputeType } from '@aws-cdk/aws-codebuild';
import { AppStage } from './app-stage';
import { env } from './global-config';

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceArtifact = new Artifact();
    const cloudAssemblyArtifact = new Artifact();

    const githubSourceAction = new GitHubSourceAction({
      actionName: 'GitHub',
      output: sourceArtifact,
      oauthToken: SecretValue.secretsManager('GITHUB_SECRET_PAT'),
      owner: 'nwitte-rocketloans',
      repo: 'nx-cdk-demo',
      branch: 'main',
    });

    const synthAction = SimpleSynthAction.standardYarnSynth({
      sourceArtifact,
      cloudAssemblyArtifact,
      subdirectory: 'apps/cdk-pipeline',
      installCommand: 'yarn install --frozen-lockfile',
      buildCommand: 'yarn nx run cdk-pipeline:build',
      synthCommand: 'yarn nx run cdk-pipeline:synth',
      environmentVariables: {
        SOURCE_ACTION_COMMIT_ID: {
          value: githubSourceAction.variables.commitId,
        },
      },
      environment: {
        buildImage: LinuxBuildImage.AMAZON_LINUX_2_3,
        computeType: ComputeType.LARGE,
        privileged: true,
      },
    });

    const pipeline = new CdkPipeline(this, 'Pipeline', {
      pipelineName: `nx-cdk-demo-pipeline`,
      cloudAssemblyArtifact,
      sourceAction: githubSourceAction,
      synthAction,
      selfMutating: true,
    });

    const stage = new AppStage(this, 'AppStage', { env });

    pipeline.addApplicationStage(stage);
  }
}
