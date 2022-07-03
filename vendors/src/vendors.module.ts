import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { VendorsService } from './services';
import configuration from './services/config';
import { VendorsController } from './vendors.controller';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [VendorsController],
  providers: [
    VendorsService,
  ],
})
export class VendorsModule {}
