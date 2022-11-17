import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { S3Client } from '@aws-sdk/client-s3';

import { FileController } from './file.controller';
import { FileService, S3Service, StoreService } from './services';
import configuration from './services/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [FileController],
  providers: [
    FileService,
    S3Service,
    StoreService,
    {
      provide: S3Client,
      useFactory: (configService: ConfigService) => {
        const S3ClientOptions = configService.get('S3ClientOptions');

        return new S3Client(S3ClientOptions);
      },
      inject: [ConfigService],
    },
  ],
})
export class FileModule {}
