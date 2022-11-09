import {
  Body,
  Controller,
  ParseFilePipe,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import ObjectId from 'bson-objectid';

import { BRAND_BGRD_SIZE, BRAND_LOGO_SIZE, MIME_TYPES } from './common/constants';
import { FilesSizePipe, FilesTypePipe } from './common/pipes';
import { IBrand, IResponse } from './common/types';
import { CreateBrand, UpdateBrand } from './decorators';
import { CreateBrandBodyDto, UpdateBrandBodyDto } from './dto';
import { JwtGuard } from './guards';
import { BrandsService, CommonService } from './services';
import {
  AuthenticatedRequest,
  ICreateBrandRes,
  ISaveBrandImagesReq,
  ISaveBrandImagesRes,
  IUpdateBrandReq,
  IUpdateBrandRes,
} from './types';


@Controller('brands')
@ApiTags('brands')
export class BrandsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly commonService: CommonService,
    private readonly brandsService: BrandsService,
  ) {
  }

  @CreateBrand()
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'logoLight', maxCount: 1 },
    { name: 'logoDark', maxCount: 1 },
    { name: 'backgroundLight', maxCount: 1 },
    { name: 'backgroundDark', maxCount: 1 },
  ]))
  @Post('/one')
  public async createBrand(
    @Body() body: CreateBrandBodyDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FilesSizePipe({
            sizes: [
              { logoLight: BRAND_LOGO_SIZE },
              { logoDark: BRAND_LOGO_SIZE },
              { backgroundLight: BRAND_BGRD_SIZE },
              { backgroundDark: BRAND_BGRD_SIZE },
            ],
          }),
          new FilesTypePipe({
            types: [
              { logoLight: [ MIME_TYPES.JPG, MIME_TYPES.PNG, MIME_TYPES.GIF ] },
              { logoDark: [ MIME_TYPES.JPG, MIME_TYPES.PNG, MIME_TYPES.GIF ] },
              { backgroundLight: [ MIME_TYPES.JPG, MIME_TYPES.PNG, MIME_TYPES.GIF ] },
              { backgroundDark: [ MIME_TYPES.JPG, MIME_TYPES.PNG, MIME_TYPES.GIF ] },
            ],
          }),
        ],
        fileIsRequired: false,
      }),
    ) files: {
      logoLight?: [Express.Multer.File];
      logoDark?: [Express.Multer.File];
      backgroundLight?: [Express.Multer.File];
      backgroundDark?: [Express.Multer.File];
    },
    @Req() req: AuthenticatedRequest,
  ): Promise<IResponse<| ICreateBrandRes | ISaveBrandImagesRes>> {
    const _id = new ObjectId();
    const brand = { ...body, _id };

    return Object.keys(files).length
      ? await this.commonService.parallelCombineRequests<IBrand, ICreateBrandRes, ISaveBrandImagesReq, ISaveBrandImagesRes>([
        { fn: this.brandsService.createBrand, args: brand },
        { fn: this.brandsService.saveBrandImages, args: { files, brand }},
      ])
      : await this.brandsService.createBrand(brand);
  }

  @UpdateBrand()
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'logoLight', maxCount: 1 },
    { name: 'logoDark', maxCount: 1 },
    { name: 'backgroundLight', maxCount: 1 },
    { name: 'backgroundDark', maxCount: 1 },
  ]))
  @Patch('/one')
  public async updateBrand(
    @Body() body: UpdateBrandBodyDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FilesSizePipe({
            sizes: [
              { logoLight: BRAND_LOGO_SIZE },
              { logoDark: BRAND_LOGO_SIZE },
              { backgroundLight: BRAND_BGRD_SIZE },
              { backgroundDark: BRAND_BGRD_SIZE },
            ],
          }),
          new FilesTypePipe({
            types: [
              { logoLight: [ MIME_TYPES.JPG, MIME_TYPES.PNG, MIME_TYPES.GIF ] },
              { logoDark: [ MIME_TYPES.JPG, MIME_TYPES.PNG, MIME_TYPES.GIF ] },
              { backgroundLight: [ MIME_TYPES.JPG, MIME_TYPES.PNG, MIME_TYPES.GIF ] },
              { backgroundDark: [ MIME_TYPES.JPG, MIME_TYPES.PNG, MIME_TYPES.GIF ] },
            ],
          }),
        ],
        fileIsRequired: false,
      }),
    ) files: {
      logoLight?: [Express.Multer.File];
      logoDark?: [Express.Multer.File];
      backgroundLight?: [Express.Multer.File];
      backgroundDark?: [Express.Multer.File];
    },
    @Req() req: AuthenticatedRequest,
  ): Promise<IResponse<| IUpdateBrandRes | ISaveBrandImagesRes>> {
    const brand: IUpdateBrandReq = { ...body };

    return Object.keys(files).length
      ? await this.commonService.sequentialCombineRequests<
          IUpdateBrandReq,
          IUpdateBrandRes,
          ISaveBrandImagesReq,
          ISaveBrandImagesRes
        >(
          [
            { fn: this.brandsService.updateBrand, args: brand },
            { fn: this.brandsService.saveBrandImages, args: { files }},
          ],
          ['brand'],
        )
      : await this.brandsService.updateBrand(brand);
  }
}
