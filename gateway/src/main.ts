import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { fastifyCookie } from 'fastify-cookie';
import fastifyCsrf from 'fastify-csrf';
import helmet from 'fastify-helmet';

import { AppModule } from './app.module';
import { HttpCommonExceptionFilter } from './common/filters';
import { PROTOCOL } from './constants';


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.useGlobalFilters(new HttpCommonExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
  });

  app.register(fastifyCookie);
  app.register(fastifyCsrf);
  app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ['\'self\''],
        styleSrc: [ '\'self\'', '\'unsafe-inline\'' ],
        imgSrc: [ '\'self\'', 'data:', 'validator.swagger.io' ],
        scriptSrc: [ '\'self\'', 'https: \'unsafe-inline\'' ],
      },
    },
  });

  const options = new DocumentBuilder()
    .setTitle('API docs')
    .addServer(process.env.ENVIRONMENT === 'prod' ? PROTOCOL.HTTPS : PROTOCOL.HTTP)
    .addTag('auth')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.API_GATEWAY_PORT);
}

bootstrap();
