import { ApiProperty } from '@nestjs/swagger';

import { Transform, TransformFnParams } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

import {
  SUPPORTED_LANGUAGES,
  SUPPORTED_LANGUAGES_ARRAY,
} from '../constants';
import { BrandTranslationLength } from '../decorators';
import { IBrandMultilingualFieldSet } from '../types';


export class BrandMultilingualFieldSetDto implements IBrandMultilingualFieldSet {
  @ApiProperty({
    description: `Language of translation. Valid values: ${SUPPORTED_LANGUAGES_ARRAY.join(', ')}`,
    required: true,
    example: SUPPORTED_LANGUAGES.HY,
  })
  @IsEnum(SUPPORTED_LANGUAGES, {
    message: `The role must be a valid value of the enum: ${SUPPORTED_LANGUAGES_ARRAY.join(', ')}`,
  })
  lang: SUPPORTED_LANGUAGES;

  @ApiProperty({
    description: 'Brand name. The length depends on language settings',
    example: 'Mitsubishi Heavy Industries',
  })
  @IsOptional()
  @IsString({ message: 'Full company name must be a string' })
  @BrandTranslationLength()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  fullName?: string;

  @ApiProperty({
    description: 'Shortened brand name. The length depends on language settings',
    example: 'MHI',
  })
  @IsOptional()
  @IsString({ message: 'Short company name must be a string' })
  @BrandTranslationLength()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  shortName?: string;

  @ApiProperty({
    description: 'Page title for SEO. The length depends on language settings',
    example: 'Best product of Mitsubishi Heavy Industries for customers of Armenia',
  })
  @IsOptional()
  @IsString({ message: 'Page title must be a string' })
  @BrandTranslationLength()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  title?: string;

  @ApiProperty({
    description: 'Short description of page for SEO. The length depends on language settings',
    example: 'Best product of Mitsubishi Heavy Industries for customers of Armenia',
  })
  @IsOptional()
  @IsString({ message: 'Short description must be a string' })
  @BrandTranslationLength()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  shortDescription?: string;

  @ApiProperty({
    description: 'Short description of page for SEO. The length depends on language settings',
    example: 'Best product of Mitsubishi Heavy Industries for customers of Armenia',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @BrandTranslationLength()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  description?: string;

  @ApiProperty({
    description: 'Keywords list of page for SEO. The length depends on language settings',
    example: 'meat grinder, kitchen appliances',
  })
  @IsOptional()
  @IsString({ message: 'Keywords must be a list of words delimited with comma' })
  @BrandTranslationLength()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  keywords?: string;
}
