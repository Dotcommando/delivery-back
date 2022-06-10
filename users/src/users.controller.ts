import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { USERS_EVENTS } from './common/constants';
import { TcpCommonExceptionFilter } from './common/filters';
import { IResponse, IUserSafe } from './common/interfaces';
import { RegisterDto } from './dto';
import { UsersService } from './services';


@UseFilters(new TcpCommonExceptionFilter())
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(USERS_EVENTS.USER_CREATE_USER)
  public async register(user: RegisterDto): Promise<IResponse<{ user: IUserSafe }>> {
    return await this.usersService.register(user);
  }
}
