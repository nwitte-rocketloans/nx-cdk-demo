import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as fastify from 'fastify';

import { AppModule } from './app/app.module';

export async function bootstrap(): Promise<fastify.FastifyInstance> {
  const serverOptions: fastify.ServerOptionsAsHttp = {
    logger: true,
  };
  const instance: fastify.FastifyInstance = fastify(serverOptions);
  const nestApp = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(instance)
  );
  nestApp.setGlobalPrefix('api');
  nestApp.enableCors();
  await nestApp.init();
  return instance;
}
