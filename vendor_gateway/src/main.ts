import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as express from 'express';

import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as morgan from 'morgan';

import { AppModule } from './app.module';
import { HttpCommonExceptionFilter } from './common/filters';
import { PROTOCOL } from './constants';
import { StatusInterceptor } from './interceptors';


async function bootstrap() {
  const server = express();

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), { cors: true });

  app.useGlobalFilters(new HttpCommonExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(new StatusInterceptor());
  app.setGlobalPrefix('api/v1');

  app.use(cookieParser());
  app.use(helmet());
  app.enableCors({
    origin: process.env.VENDOR_CORS_ORIGIN,
  });

  if (process.env.ENVIRONMENT === 'dev') {
    app.use(morgan('tiny'));
  }

  const options = new DocumentBuilder()
    .setTitle('API docs')
    .addServer(process.env.ENVIRONMENT === 'prod' ? PROTOCOL.HTTPS : PROTOCOL.HTTP)
    .addTag('auth')
    .addTag('vendors')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.VENDOR_GATEWAY_PORT);
}

bootstrap();
