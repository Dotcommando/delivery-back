import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { USERS_EVENTS } from './common/constants';
import { TcpCommonExceptionFilter } from './common/filters';
import { IResponse, IUser } from './common/types';
import { GetUserBodyDto, RegisterBodyDto, ReissueTokensBodyDto, SignInBodyDto, VerifyAccessTokenBodyDto } from './dto';
import { UsersService } from './services';
import { IIssueTokensRes, ISignInRes, IVerifyTokenRes } from './types';


@UseFilters(new TcpCommonExceptionFilter())
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(USERS_EVENTS.USER_CREATE_USER)
  public async register(user: RegisterBodyDto): Promise<IResponse<{ user: IUser }>> {
    return await this.usersService.register(user);
  }

  @MessagePattern(USERS_EVENTS.USER_ISSUE_TOKENS)
  public async signIn(user: SignInBodyDto): Promise<IResponse<ISignInRes>> {
    return await this.usersService.signIn(user);
  }

  @MessagePattern(USERS_EVENTS.USER_VERIFY_ACCESS_TOKEN)
  public async verifyAccessToken(data: VerifyAccessTokenBodyDto): Promise<IResponse<IVerifyTokenRes>> {
    return await this.usersService.verifyAccessToken(data);
  }

  @MessagePattern(USERS_EVENTS.USER_GET_USER)
  public async getUser(data: GetUserBodyDto): Promise<IResponse<{ user: IUser }>> {
    return await this.usersService.getUser(data);
  }

  @MessagePattern(USERS_EVENTS.USER_REISSUE_TOKENS)
  public async reissueTokens(data: ReissueTokensBodyDto): Promise<IResponse<IIssueTokensRes>> {
    return await this.usersService.reissueTokens(data);
  }
}
