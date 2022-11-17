import { Transport } from '@nestjs/microservices';

export default () => ({
  port: process.env.VENDOR_GATEWAY_PORT,
  corsOrigin: process.env.VENDOR_CORS_ORIGIN,
  environment: process.env.ENVIRONMENT,
  maxTimeOfRequestWaiting: process.env.MAX_TIME_OF_REQUEST_WAITING,
  vendorsService: {
    options: {
      port: process.env.VENDORS_SERVICE_PORT,
      host: process.env.VENDORS_SERVICE_HOST,
    },
    transport: Transport.TCP,
  },
  fileService: {
    options: {
      port: process.env.FILE_PROCESSING_PORT,
      host: process.env.FILE_PROCESSING_HOST,
    },
    transport: Transport.TCP,
  },
  ttl: parseInt(process.env.IN_MEMORY_STORAGE_NOTE_TTL), // minutes
  ttlForHoldingFileSavingResult: parseInt(process.env.IN_MEMORY_STORAGE_FILE_SAVING_RESULT), // minutes
  fileFragmentMaxLength: parseInt(process.env.MAX_TCP_FILE_FRAGMENT_LENGTH) * 1024, // bytes
  maxFailedAttempts: parseInt(process.env.MAX_FAILED_ATTEMPTS),
});