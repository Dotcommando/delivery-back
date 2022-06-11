import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { USERS_EVENTS } from './common/constants';
import { TcpCommonExceptionFilter } from './common/filters';
import { IResponse, IUserSafe } from './common/interfaces';
import { RegisterDto, SignInDto } from './dto';
import { UsersService } from './services';
import { ISignInRes, IValidateUserRes } from './types';


@UseFilters(new TcpCommonExceptionFilter())
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(USERS_EVENTS.USER_CREATE_USER)
  public async register(user: RegisterDto): Promise<IResponse<{ user: IUserSafe }>> {
    return await this.usersService.register(user);
  }

  @MessagePattern(USERS_EVENTS.USER_VALIDATE_USER)
  public async validateUser(user: SignInDto): Promise<IResponse<IValidateUserRes>> {
    return await this.usersService.validateUser(user);
  }

  @MessagePattern(USERS_EVENTS.USER_ISSUE_TOKENS)
  public async issueTokens(user: SignInDto): Promise<IResponse<ISignInRes>> {
    return await this.usersService.issueTokens(user);
  }
}
