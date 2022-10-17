import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { FileController } from './file.controller';
import { FileService, StoreService } from './services';
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
    StoreService,
  ],
})
export class FileModule {}
