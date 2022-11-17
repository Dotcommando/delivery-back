import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthController } from './auth.controller';
import { BrandsController } from './brands.controller';
import { CompaniesController } from './companies.controller';
import {
  AuthService,
  BrandsService,
  CommonService,
  FileProcessingService,
  StoreService,
  VendorsService,
} from './services';
import configuration from './services/config';
import { LocalStrategy } from './strategies';
import { VendorsController } from './vendors.controller';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [
    AuthController,
    VendorsController,
    BrandsController,
    CompaniesController,
  ],
  providers: [
    AuthService,
    CommonService,
    BrandsService,
    FileProcessingService,
    StoreService,
    VendorsService,
    LocalStrategy,
    {
      provide: 'VENDOR_SERVICE',
      useFactory: (configService: ConfigService) => {
        const vendorServiceOptions = configService.get('vendorsService');
        return ClientProxyFactory.create(vendorServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'FILE_SERVICE',
      useFactory: (configService: ConfigService) => {
        const fileServiceOptions = configService.get('fileService');
        return ClientProxyFactory.create(fileServiceOptions);
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
