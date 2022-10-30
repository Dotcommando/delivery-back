import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

import { Transform, Type } from 'class-transformer';
import { IsArray, IsDefined, IsOptional, MaxLength, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';

import { BrandMultilingualFieldSetDto } from './brand-multilingual-field-set.dto';

import { IMAGE_ADDRESS_MAX_LENGTH } from '../constants';
import { toObjectId } from '../helpers';


export class BrandBodyDto {
  @ApiProperty({
    description: 'It matches \'_id\' from collection \'brands\' from DB. Valid MongoDB compatible ObjectId',
    required: true,
    example: '62a584a2f2fdd2cf95548236',
  })
  @IsDefined()
  @Transform(toObjectId)
  @Type(() => Types.ObjectId)
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'It matches \'_id\' from collection \'companies\' from DB. Valid MongoDB compatible ObjectId',
    required: true,
    example: '62a584a2f2fdd2cf95548236',
  })
  @IsDefined()
  @Transform(toObjectId)
  @Type(() => Types.ObjectId)
  company: Types.ObjectId;

  @ApiProperty({
    description: 'Filename with extension',
    example: 'light-background-2022-10-24-12-53-04-097-9800fc.jpg',
  })
  @IsOptional()
  @MaxLength(IMAGE_ADDRESS_MAX_LENGTH, {
    message: `Light background filename length must be equal or shorter ${IMAGE_ADDRESS_MAX_LENGTH} characters`,
  })
  backgroundLight: string;

  @ApiProperty({
    description: 'Filename with extension',
    example: 'dark-background-2022-10-24-12-53-04-097-9800fc.jpg',
  })
  @IsOptional()
  @MaxLength(IMAGE_ADDRESS_MAX_LENGTH, {
    message: `Dark background filename length must be equal or shorter ${IMAGE_ADDRESS_MAX_LENGTH} characters`,
  })
  backgroundDark: string;

  @ApiProperty({
    description: 'Filename with extension',
    example: 'logo-2022-10-24-12-53-04-097-9800fc.jpg',
  })
  @IsOptional()
  @MaxLength(IMAGE_ADDRESS_MAX_LENGTH, {
    message: `Logotype filename length must be equal or shorter ${IMAGE_ADDRESS_MAX_LENGTH} characters`,
  })
  logo: string;

  @ApiProperty({
    example: [
      {

      },
      {

      },
    ],
  })
  @IsOptional()
  @IsArray({ message: 'Field \'translation\' must contain array of translations of brand data' })
  @ValidateNested({ each: true })
  @Type(() => BrandMultilingualFieldSetDto)
  translations: BrandMultilingualFieldSetDto[];
}

export class PartialBrandDto extends PartialType(BrandBodyDto) {}
