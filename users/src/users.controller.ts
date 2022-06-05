import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { Observable } from 'rxjs';

import { USERS_EVENTS } from './common/constants';
import { TcpCommonExceptionFilter } from './common/filters';
import { UsersService } from './services';


@UseFilters(TcpCommonExceptionFilter)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(USERS_EVENTS.USER_CREATE_USER)
  public register(data): Observable<unknown> {
    return this.usersService.getHello(data);
  }
}
