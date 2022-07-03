import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { VendorsModule } from './vendors.module';


async function bootstrap() {
  const app = await NestFactory.createMicroservice(VendorsModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.VENDORS_SERVICE_HOST,
      port: process.env.VENDORS_SERVICE_PORT,
    },
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen();
}

bootstrap();
