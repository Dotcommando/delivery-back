import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { BrandsController } from './brands.controller';
import { CompaniesController } from './companies.controller';
import { AddressSchema, BrandSchema, CompanySchema, TokenSchema, VendorSchema } from './schemas';
import {
  BrandDbAccessService,
  BrandsService,
  CompaniesService,
  CompanyDbAccessService,
  JwtConfigService,
  MongoConfigService,
  VendorDbAccessService,
  VendorsService,
} from './services';
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
    MongooseModule.forFeature([
      {
        name: 'Company',
        schema: CompanySchema,
        collection: 'companies',
      },
    ]),
    MongooseModule.forFeature([
      {
        name: 'Brand',
        schema: BrandSchema,
        collection: 'brands',
      },
    ]),
  ],
  controllers: [
    BrandsController,
    CompaniesController,
    VendorsController,
  ],
  providers: [
    BrandDbAccessService,
    BrandsService,
    CompaniesService,
    CompanyDbAccessService,
    VendorDbAccessService,
    VendorsService,
  ],
})
export class VendorsModule {}
