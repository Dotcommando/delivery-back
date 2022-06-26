import { Body, Controller, Get, Inject, Param, Put, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { lastValueFrom, timeout } from 'rxjs';

import { MAX_TIME_OF_REQUEST_WAITING, USERS_EVENTS } from './common/constants';
import { IAddress, IResponse, IUser } from './common/types';
import { GetUser } from './decorators';
import {
  EditAddressesBodyDto,
  EditAddressesParamDto,
  GetUserParamDto,
  UpdateUserBodyDto,
  UpdateUserParamDto,
} from './dto';
import { JwtGuard } from './guards';
import { UsersService } from './services';
import { AuthenticatedRequest, IEditAddresses } from './types';


@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {
  }

  @GetUser()
  @UseGuards(JwtGuard)
  @Get('one/:_id')
  public async getUser(
    @Param() param: GetUserParamDto,
  ): Promise<IResponse<{ user: IUser<IAddress> }>> {
    return await lastValueFrom(
      this.userServiceClient
        .send(USERS_EVENTS.USER_GET_USER, { _id: param._id })
        .pipe(timeout(MAX_TIME_OF_REQUEST_WAITING)),
    );
  }

  @UseGuards(JwtGuard)
  @Put('one/:_id')
  public async updateUser(
    @Param() param: UpdateUserParamDto,
    @Body() body: UpdateUserBodyDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<IResponse<{ user: IUser }>> {
    const user: IUser | null = req?.user ?? null;

    return await this.usersService.updateUser({ _id: user._id, body, user });
  }

  @UseGuards(JwtGuard)
  @Put('addresses/:_id')
  public async editAddresses(
    @Param() param: EditAddressesParamDto,
    @Body() body: EditAddressesBodyDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<IResponse<IEditAddresses>> {
    const user: IUser | null = req?.user ?? null;

    return await lastValueFrom(
      this.userServiceClient
        .send(USERS_EVENTS.USER_EDIT_ADDRESSES, { ...body, _id: user._id })
        .pipe(timeout(MAX_TIME_OF_REQUEST_WAITING)),
    );
  }
}
