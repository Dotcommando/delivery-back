import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseFilePipe,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { lastValueFrom, timeout } from 'rxjs';

import { AVATAR_FILE_BYTE_SIZE, MAX_TIME_OF_REQUEST_WAITING, VENDORS_EVENTS } from './common/constants';
import { FileSizeValidationPipe } from './common/helpers';
import { IAddress, IResponse, IVendor } from './common/types';
import { ReadVendor, UpdateVendor } from './decorators';
import {
  DeleteUserParamDto,
  ReadVendorParamDto,
  UpdateVendorDto,
  UpdateVendorParamDto,
} from './dto';
import { JustMeGuard, JwtGuard } from './guards';
import { VendorsService } from './services';
import { AuthenticatedRequest, IDeleteUserRes } from './types';


@Controller('vendors')
@ApiTags('vendors')
export class VendorsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly vendorsService: VendorsService,
    @Inject('VENDOR_SERVICE') private readonly vendorServiceClient: ClientProxy,
  ) {
  }

  @ReadVendor()
  @UseGuards(JustMeGuard)
  @Get('me/:_id')
  public async readMe(
    @Param() param: ReadVendorParamDto,
  ): Promise<IResponse<{ user: IVendor<IAddress> }>> {
    return await lastValueFrom(
      this.vendorServiceClient
        .send(VENDORS_EVENTS.VENDOR_READ_VENDOR, { _id: param._id })
        .pipe(timeout(MAX_TIME_OF_REQUEST_WAITING)),
    );
  }

  @UpdateVendor()
  @UseInterceptors(FileInterceptor('avatar'))
  @UseGuards(JustMeGuard)
  @Put('me/:_id')
  public async updateMe(
    @Param() param: UpdateVendorParamDto,
    @Body() body: UpdateVendorDto,
    @Req() req: AuthenticatedRequest,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileSizeValidationPipe({ maxFileSize: AVATAR_FILE_BYTE_SIZE }),
        ],
      }),
    ) avatar: Express.Multer.File,
  ): Promise<IResponse<{ user: IVendor<IAddress> }>> {
    const user: IVendor | null = req?.user ?? null;

    console.log(' ');
    console.log('avatar:');
    console.log(avatar);

    return await this.vendorsService.updateVendor({ _id: param._id, body, user });
  }

  @UseGuards(JustMeGuard)
  @Delete('me/:_id')
  public async deleteMe(
    @Param() param: DeleteUserParamDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<IResponse<IDeleteUserRes>> {
    const user: IVendor | null = req?.user ?? null;

    return await this.vendorsService.deleteUser({ _id: user._id, user });
  }
}
