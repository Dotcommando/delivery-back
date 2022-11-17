import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import ObjectId from 'bson-objectid';

import { IResponse } from './common/types';
import { CreateBrand, DeleteBrand, UpdateBrand } from './decorators';
import {
  CreateBrandBodyDto,
  DeleteBrandParamDto,
  ReadBrandParamDto,
  UpdateBrandBodyDto,
  UpdateBrandParamDto,
} from './dto';
import { JwtGuard } from './guards';
import { getFileInterceptorSettings, getFilePipe } from './helpers';
import { BrandsService, CommonService } from './services';
import {
  IBrandFiles,
  ICreateBrand,
  ICreateBrandRes,
  IReadBrandRes,
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
  @UseInterceptors(FileFieldsInterceptor(getFileInterceptorSettings()))
  @Post('/one')
  public async createBrand(
    @Body() body: CreateBrandBodyDto,
    @UploadedFiles(getFilePipe()) files: IBrandFiles,
  ): Promise<IResponse<| ICreateBrandRes | ISaveBrandImagesRes>> {
    const _id = new ObjectId();
    const brand = { ...body, _id };

    return Object.keys(files).length
      ? await this.commonService.parallelCombineRequests<ICreateBrand, ICreateBrandRes, ISaveBrandImagesReq, ISaveBrandImagesRes>([
        { fn: this.brandsService.createBrand, args: brand },
        { fn: this.brandsService.saveBrandImages, args: { files, brand }},
      ])
      : await this.brandsService.createBrand(brand);
  }

  @Get('/one/:_id')
  public async readBrand(
    @Param() param: ReadBrandParamDto,
  ): Promise<IResponse<IReadBrandRes>> {
    return await this.brandsService.readBrand(param);
  }

  @UpdateBrand()
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileFieldsInterceptor(getFileInterceptorSettings()))
  @Patch('/one/:_id')
  public async updateBrand(
    @Body() body: UpdateBrandBodyDto,
    @Param() param: UpdateBrandParamDto,
    @UploadedFiles(getFilePipe()) files: IBrandFiles,
  ): Promise<IResponse<| IUpdateBrandRes | ISaveBrandImagesRes>> {
    const brand: IUpdateBrandReq = { ...body, _id: param._id };

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

  @DeleteBrand()
  @UseGuards(JwtGuard)
  @Delete('one/:_id')
  public async deleteBrand(
    @Param() param: DeleteBrandParamDto,
  ): Promise<IResponse<null>> {
    return await this.brandsService.deleteBrand({ _id: param._id });
  }
}
