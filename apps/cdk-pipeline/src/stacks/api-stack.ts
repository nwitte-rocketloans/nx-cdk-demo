import { DockerImageCode, DockerImageFunction } from '@aws-cdk/aws-lambda';
import {
  CfnOutput,
  Construct,
  Duration,
  Stack,
  StackProps,
} from '@aws-cdk/core';
import * as path from 'path';
import { LambdaRestApi } from '@aws-cdk/aws-apigateway';

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const directory = path.join(
      __dirname,
      '../../../..',
      'dist/apps/api/lambda'
    );

    const code = DockerImageCode.fromImageAsset(directory);

    const func = new DockerImageFunction(this, 'LambdaFunction', {
      functionName: `nx-cdk-demo-api`,
      code,
      description: `API Lambda Function`,
      timeout: Duration.seconds(30),
      memorySize: 1024,
    });

    const api = new LambdaRestApi(this, 'LambdaRestApi', {
      handler: func,
      restApiName: 'nx-cdk-demo-api',
    });

    new CfnOutput(this, 'LambdaApiUri', {
      value: api.url,
      exportName: 'api-url',
      description: 'Lambda API URL',
    });
  }
}
