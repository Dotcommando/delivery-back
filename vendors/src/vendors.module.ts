import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AddressSchema, TokenSchema, VendorSchema } from './schemas';
import { DbAccessService, JwtConfigService, MongoConfigService, VendorsService } from './services';
import configuration from './services/config';
import { VendorsController } from './vendors.controller';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      useClass: MongoConfigService,
    }),
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    MongooseModule.forFeature([
      {
        name: 'Vendor',
        schema: VendorSchema,
        collection: 'vendors',
      },
    ]),
    MongooseModule.forFeature([
      {
        name: 'Token',
        schema: TokenSchema,
        collection: 'tokens',
      },
    ]),
    MongooseModule.forFeature([
      {
        name: 'Address',
        schema: AddressSchema,
        collection: 'addresses',
      },
    ]),
  ],
  controllers: [VendorsController],
  providers: [
    DbAccessService,
    VendorsService,
  ],
})
export class VendorsModule {}
