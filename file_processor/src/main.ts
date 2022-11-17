import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { FileModule } from './file.module';


async function bootstrap() {
  const app = await NestFactory.createMicroservice(FileModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.FILE_PROCESSING_HOST,
      port: process.env.FILE_PROCESSING_PORT,
    },
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen();
}

bootstrap();
