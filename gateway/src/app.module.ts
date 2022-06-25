import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';

import { AuthController } from './auth.controller';
import { AuthService, UsersService } from './services';
import configuration from './services/config';
import { LocalStrategy } from './strategies';
import { UsersController } from './users.controller';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [
    AuthController,
    UsersController,
  ],
  providers: [
    AuthService,
    UsersService,
    LocalStrategy,
    {
      provide: 'USER_SERVICE',
      useFactory: (configService: ConfigService) => {
        const userServiceOptions = configService.get('usersService');
        return ClientProxyFactory.create(userServiceOptions);
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
