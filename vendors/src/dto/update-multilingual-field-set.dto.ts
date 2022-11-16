import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsDefined, IsEnum, IsOptional, IsString } from 'class-validator';

import { SUPPORTED_LANGUAGES, SUPPORTED_LANGUAGES_ARRAY } from '../common/constants';
import { BrandTranslationLength, ValidateIfNull } from '../common/decorators';
import { sanitizeStringIfNotNull } from '../common/helpers';
import { IUpdateBrandMultilingualFieldSet } from '../common/types';


export class UpdateMultilingualFieldSetDto implements IUpdateBrandMultilingualFieldSet {
  @ApiProperty({
    description: `Language of translation. Valid values: ${SUPPORTED_LANGUAGES_ARRAY.join(', ')}`,
    required: true,
    example: SUPPORTED_LANGUAGES.HY,
  })
  @IsDefined({ message: 'Each translation set must have a defined language in \'lang\' field' })
  @IsEnum(SUPPORTED_LANGUAGES, {
    message: `The role must be a valid value of the enum: ${SUPPORTED_LANGUAGES_ARRAY.join(', ')}`,
  })
  lang: SUPPORTED_LANGUAGES;

  @ApiProperty({
    description: 'Brand name. The length depends on language settings.',
    example: 'Mitsubishi Heavy Industries',
  })
  @IsOptional()
  @BrandTranslationLength()
  @ValidateIfNull()
  @Transform(sanitizeStringIfNotNull)
  fullName?: string | null;

  @ApiProperty({
    description: 'Shortened brand name. The length depends on language settings',
    example: 'MHI',
  })
  @IsOptional()
  @BrandTranslationLength()
  @ValidateIfNull()
  @Transform(sanitizeStringIfNotNull)
  shortName?: string | null;

  @ApiProperty({
    description: 'Page title for SEO. The length depends on language settings',
    example: 'Best product of Mitsubishi Heavy Industries for customers of Armenia',
  })
  @IsOptional()
  @BrandTranslationLength()
  @ValidateIfNull()
  @Transform(sanitizeStringIfNotNull)
  title?: string | null;

  @ApiProperty({
    description: 'Short description of page for SEO. The length depends on language settings',
    example: 'Best product of Mitsubishi Heavy Industries for customers of Armenia',
  })
  @IsOptional()
  @IsString({ message: 'Short description must be a string' })
  @BrandTranslationLength()
  @ValidateIfNull()
  @Transform(sanitizeStringIfNotNull)
  shortDescription?: string | null;

  @ApiProperty({
    description: 'Short description of page for SEO. The length depends on language settings',
    example: 'Best product of Mitsubishi Heavy Industries for customers of Armenia',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @BrandTranslationLength()
  @ValidateIfNull()
  @Transform(sanitizeStringIfNotNull)
  description?: string | null;

  @ApiProperty({
    description: 'Keywords list of page for SEO. The length depends on language settings',
    example: 'meat grinder, kitchen appliances',
  })
  @IsOptional()
  @IsString({ message: 'Keywords must be a list of words delimited with comma' })
  @BrandTranslationLength()
  @ValidateIfNull()
  @Transform(sanitizeStringIfNotNull)
  keywords?: string | null;
}
