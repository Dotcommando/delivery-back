import { Module } from '@nestjs/common';

import { UsersService } from './services';
import { UsersController } from './users.controller';


@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
