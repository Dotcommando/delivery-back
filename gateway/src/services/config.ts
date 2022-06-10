import { Transport } from '@nestjs/microservices';

export default () => ({
  port: process.env.API_GATEWAY_PORT,
  corsOrigin: process.env.CORS_ORIGIN,
  environment: process.env.ENVIRONMENT,
  maxTimeOfRequestWaiting: process.env.MAX_TIME_OF_REQUEST_WAITING,
  usersService: {
    options: {
      port: process.env.USERS_SERVICE_PORT,
      host: process.env.USERS_SERVICE_HOST,
    },
    transport: Transport.TCP,
  },
});
