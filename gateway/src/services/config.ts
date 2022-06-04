import { Transport } from '@nestjs/microservices';

export default () => ({
  port: process.env.API_GATEWAY_PORT,
  corsOrigin: process.env.CORS_ORIGIN,
  environment: process.env.ENVIRONMENT,
  usersService: {
    options: {
      port: process.env.USERS_SERVICE_PORT,
      host: process.env.USERS_SERVICE_HOST,
    },
    transport: Transport.TCP,
  },
});
