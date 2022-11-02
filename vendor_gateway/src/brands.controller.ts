import {
  Body,
  Controller,
  ParseFilePipe,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { BRAND_BGRD_SIZE, BRAND_LOGO_SIZE, MIME_TYPES } from './common/constants';
import { FilesSizePipe, FilesTypePipe } from './common/pipes';
import { IResponse } from './common/types';
import { CreateBrand } from './decorators';
import { CreateBrandBodyDto } from './dto';
import { JwtGuard } from './guards';
import { BrandsService } from './services';
import { AuthenticatedRequest, ICreateBrandRes } from './types';


@Controller('brands')
@ApiTags('brands')
export class BrandsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly brandsService: BrandsService,
  ) {
  }

  @CreateBrand()
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'logo', maxCount: 1 },
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
              { logo: BRAND_LOGO_SIZE },
              { backgroundLight: BRAND_BGRD_SIZE },
              { backgroundDark: BRAND_BGRD_SIZE },
            ],
          }),
          new FilesTypePipe({
            types: [
              { logo: [ MIME_TYPES.JPG, MIME_TYPES.PNG, MIME_TYPES.GIF ] },
              { backgroundLight: [ MIME_TYPES.JPG, MIME_TYPES.PNG, MIME_TYPES.GIF ] },
              { backgroundDark: [ MIME_TYPES.JPG, MIME_TYPES.PNG, MIME_TYPES.GIF ] },
            ],
          }),
        ],
        fileIsRequired: false,
      }),
    ) files: {
      logo?: Express.Multer.File[];
      backgroundLight?: Express.Multer.File[];
      backgroundDark?: Express.Multer.File[];
    },
    @Req() req: AuthenticatedRequest,
  ): Promise<IResponse<ICreateBrandRes>> {
    return await this.brandsService.createBrand(body);
  }
}
