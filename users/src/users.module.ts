import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AddressSchema, UserSchema } from './schemas';
import { MongoConfigService, UsersService } from './services';
import configuration from './services/config';
import { UsersController } from './users.controller';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      useClass: MongoConfigService,
    }),
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
        collection: 'users',
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
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
