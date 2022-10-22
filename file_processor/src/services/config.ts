export default () => ({
  environment: process.env.ENVIRONMENT,
  vendorBaseUri: process.env.VENDOR_BASE_URI,
  vendorGatewayPort: process.env.VENDOR_GATEWAY_PORT,
  host: process.env.FILE_PROCESSING_HOST,
  port: process.env.FILE_PROCESSING_PORT,
  ttl: parseInt(process.env.IN_MEMORY_STORAGE_NOTE_TTL),
  ttlAfterSaving: parseInt(process.env.IN_MEMORY_STORAGE_FILE_SAVING_RESULT),
  S3ClientOptions: {
    region: process.env.S3_BUCKET_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    },
  },
  imageStorageName: process.env.S3_BUCKET_NAME,
});
