import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';

import { AuthController } from './auth.controller';
import { AuthService, VendorsService } from './services';
import configuration from './services/config';
import { LocalStrategy } from './strategies';
import { VendorsController } from './vendors.controller';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [
    AuthController,
    VendorsController,
  ],
  providers: [
    AuthService,
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
