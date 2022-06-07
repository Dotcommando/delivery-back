export default () => ({
  environment: process.env.ENVIRONMENT,
  baseUri: process.env.BASE_URI,
  gatewayPort: process.env.API_GATEWAY_PORT,
  host: process.env.USERS_SERVICE_HOST,
  port: process.env.USERS_SERVICE_PORT,
});
