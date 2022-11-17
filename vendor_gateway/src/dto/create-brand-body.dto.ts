import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

import { ArrayMaxSize, IsArray, IsOptional } from 'class-validator';

import { BrandDto } from '../common/dto';


export class CreateBrandBodyDto extends OmitType(BrandDto, [
  '_id',
  'logoLight',
  'logoDark',
  'backgroundLight',
  'backgroundDark',
]) {
  @ApiProperty({
    description: 'Logo for light mode of the interface',
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(1)
  logoLight: [Express.Multer.File];

  @ApiProperty({
    description: 'Logo for dark mode of the interface',
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(1)
  logoDark: [Express.Multer.File];

  @ApiProperty({
    description: 'Background for light mode of the interface',
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(1)
  backgroundLight: [Express.Multer.File];

  @ApiProperty({
    description: 'Background for dark mode of the interface',
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(1)
  backgroundDark: [Express.Multer.File];
}
