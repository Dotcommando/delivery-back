import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { Observable, of } from 'rxjs';

import { USERS_EVENTS } from './common/constants';
import { TcpCommonExceptionFilter } from './common/filters';
import { UserDto } from './dto';
import { UsersService } from './services';


@UseFilters(TcpCommonExceptionFilter)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(USERS_EVENTS.USER_CREATE_USER)
  public register(user: UserDto): Observable<unknown> {
    console.log(' ');
    console.log('user');
    console.dir(user);

    return of({
      status: 200,
      user,
    });
  }
}
