import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import helmet from '@fastify/helmet';

import { fastifyCookie } from 'fastify-cookie';
import fastifyCsrf from 'fastify-csrf';
import * as morgan from 'morgan';

import { AppModule } from './app.module';
import { HttpCommonExceptionFilter } from './common/filters';
import { PROTOCOL } from './constants';
import { StatusInterceptor } from './interceptors';


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.useGlobalFilters(new HttpCommonExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(new StatusInterceptor());
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: process.env.CUSTOMER_CORS_ORIGIN,
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

  if (process.env.ENVIRONMENT === 'dev') {
    app.use(morgan('tiny'));
  }

  const options = new DocumentBuilder()
    .setTitle('API docs')
    .addServer(process.env.ENVIRONMENT === 'prod' ? PROTOCOL.HTTPS : PROTOCOL.HTTP)
    .addTag('auth')
    .addTag('users')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.CUSTOMER_GATEWAY_PORT);
}

bootstrap();
