import { Body, Controller, Get, Inject, Param, Put, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { lastValueFrom, timeout } from 'rxjs';

import { MAX_TIME_OF_REQUEST_WAITING, USERS_EVENTS } from './common/constants';
import { IResponse, IUser } from './common/types';
import { EditAddressesBodyDto, EditAddressesParamDto, GetUserParamDto } from './dto';
import { JwtGuard } from './guards';
import { AuthenticatedRequest, IEditAddresses } from './types';


@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly configService: ConfigService,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {
  }

  @UseGuards(JwtGuard)
  @Get('one/:_id')
  public async getUser(
    @Param() param: GetUserParamDto,
  ): Promise<IResponse<{ user: IUser }>> {
    return await lastValueFrom(
      this.userServiceClient
        .send(USERS_EVENTS.USER_GET_USER, { _id: param._id })
        .pipe(timeout(MAX_TIME_OF_REQUEST_WAITING)),
    );
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
        .send(USERS_EVENTS.USER_EDIT_ADDRESSES, { ...body, userId: user._id })
        .pipe(timeout(MAX_TIME_OF_REQUEST_WAITING)),
    );
  }
}
