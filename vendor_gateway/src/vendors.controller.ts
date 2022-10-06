import { Body, Controller, Delete, Get, Inject, Param, Put, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { lastValueFrom, timeout } from 'rxjs';

import { MAX_TIME_OF_REQUEST_WAITING, VENDORS_EVENTS } from './common/constants';
import { IAddress, IResponse, IUser } from './common/types';
import { GetUser, UpdateUser } from './decorators';
import {
  DeleteUserParamDto,
  GetUserParamDto,
  UpdateUserBodyDto,
  UpdateUserParamDto,
} from './dto';
import { JwtGuard } from './guards';
import { VendorsService } from './services';
import { AuthenticatedRequest, IDeleteUserRes } from './types';


@Controller('vendors')
@ApiTags('vendors')
export class VendorsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: VendorsService,
    @Inject('VENDOR_SERVICE') private readonly vendorServiceClient: ClientProxy,
  ) {
  }

  @GetUser()
  @UseGuards(JwtGuard)
  @Get('one/:_id')
  public async getUser(
    @Param() param: GetUserParamDto,
  ): Promise<IResponse<{ user: IUser<IAddress> }>> {
    return await lastValueFrom(
      this.vendorServiceClient
        .send(VENDORS_EVENTS.VENDOR_GET_USER, { _id: param._id })
        .pipe(timeout(MAX_TIME_OF_REQUEST_WAITING)),
    );
  }

  @UpdateUser()
  @UseGuards(JwtGuard)
  @Put('one/:_id')
  public async updateUser(
    @Param() param: UpdateUserParamDto,
    @Body() body: UpdateUserBodyDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<IResponse<{ user: IUser<IAddress> }>> {
    const user: IUser | null = req?.user ?? null;

    return await this.usersService.updateUser({ _id: param._id, body, user });
  }

  @UseGuards(JwtGuard)
  @Delete('one/:_id')
  public async deleteUser(
    @Param() param: DeleteUserParamDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<IResponse<IDeleteUserRes>> {
    const user: IUser | null = req?.user ?? null;

    return await this.usersService.deleteUser({ _id: user._id, user });
  }
}
