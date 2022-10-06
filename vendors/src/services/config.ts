export default () => ({
  environment: process.env.ENVIRONMENT,
  baseUri: process.env.VENDOR_BASE_URI,
  gatewayPort: process.env.VENDOR_GATEWAY_PORT,
  host: process.env.VENDORS_SERVICE_HOST,
  port: process.env.VENDORS_SERVICE_PORT,
});
