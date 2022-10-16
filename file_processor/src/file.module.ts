import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { FileController } from './file.controller';
import { FileService } from './services';
import configuration from './services/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [FileController],
  providers: [
    FileService,
  ],
})
export class FileModule {}
