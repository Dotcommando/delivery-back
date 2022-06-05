import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { UsersModule } from './users.module';


async function bootstrap() {
  const app = await NestFactory.createMicroservice(UsersModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.USERS_SERVICE_HOST,
      port: process.env.USERS_SERVICE_PORT,
    },
  });

  await app.listen();
}

bootstrap();
