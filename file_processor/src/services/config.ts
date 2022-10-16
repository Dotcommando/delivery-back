export default () => ({
  environment: process.env.ENVIRONMENT,
  vendorBaseUri: process.env.VENDOR_BASE_URI,
  vendorGatewayPort: process.env.VENDOR_GATEWAY_PORT,
  host: process.env.FILE_PROCESSING_HOST,
  port: process.env.FILE_PROCESSING_PORT,
});
