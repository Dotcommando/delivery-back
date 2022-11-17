import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseFilePipe,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { lastValueFrom, timeout } from 'rxjs';

import {
  AVATAR_FILE_BYTE_SIZE,
  MAX_TIME_OF_REQUEST_WAITING,
  MIME_TYPES,
  VENDORS_EVENTS,
} from './common/constants';
import { FileSizePipe, FileTypePipe } from './common/pipes';
import { IAddress, IResponse, IVendor } from './common/types';
import { DeleteVendor, GetAvatarData, ReadVendor, UpdateVendor } from './decorators';
import {
  DeleteUserParamDto,
  GetAvatarDataParamDto,
  ReadVendorParamDto,
  UpdateVendorBodyDto,
  UpdateVendorParamDto,
} from './dto';
import { JustMeGuard } from './guards';
import { CommonService, VendorsService } from './services';
import {
  AuthenticatedRequest,
  IDeleteUserRes,
  IGetAvatarDataRes,
  IImageSavingInited,
  IUpdateVendorData,
  IUpdateVendorImagesReq,
  IUpdateVendorRes,
} from './types';


@Controller('vendors')
@ApiTags('vendors')
export class VendorsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly commonService: CommonService,
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @UseGuards(JustMeGuard)
  @Patch('me/:_id')
  public async updateMe(
    @Param() param: UpdateVendorParamDto,
    @Body() body: UpdateVendorBodyDto,
    @Req() req: AuthenticatedRequest,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileSizePipe({ maxFileSize: AVATAR_FILE_BYTE_SIZE }),
          new FileTypePipe({ acceptableTypes: [ MIME_TYPES.JPG, MIME_TYPES.PNG, MIME_TYPES.GIF ] }),
        ],
        fileIsRequired: false,
      }),
    ) avatar?: Express.Multer.File,
  ): Promise<IResponse<| IUpdateVendorRes | IImageSavingInited>> {
    const user: IVendor = req.user;

    return Boolean(avatar) || 'avatar' in body
      ? await this.commonService.parallelCombineRequests<IUpdateVendorData, IUpdateVendorRes, IUpdateVendorImagesReq, IImageSavingInited>([
        { fn: this.vendorsService.updateVendor, args: { _id: param._id, body, user }},
        { fn: this.vendorsService.updateVendorImages, args: { user, avatar: 'avatar' in body && !body.avatar ? null : avatar }},
      ])
      : await this.vendorsService.updateVendor({
        _id: param._id,
        body,
        user,
      });
  }

  @DeleteVendor()
  @UseGuards(JustMeGuard)
  @Delete('me/:_id')
  public async deleteMe(
    @Param() param: DeleteUserParamDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<IResponse<IDeleteUserRes>> {
    const user: IVendor | null = req?.user ?? null;

    return await this.vendorsService.deleteUser({ _id: user._id, user });
  }

  @GetAvatarData()
  @Get('image-status/:sessionUUID')
  public async getImageStatus(
    @Param() param: GetAvatarDataParamDto,
  ): Promise<IResponse<IGetAvatarDataRes>> {
    return this.vendorsService.getImageStatus(param.sessionUUID);
  }
}
