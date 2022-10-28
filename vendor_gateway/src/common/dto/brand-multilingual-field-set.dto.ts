import { ApiProperty } from '@nestjs/swagger';

import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

import { COMPANY_NAME_MAX_LENGTH, COMPANY_NAME_MIN_LENGTH, NAME_REGEXP } from '../constants';
import { maxLengthStringMessage, minLengthStringMessage } from '../helpers';
import { IBrandMultilingualFieldSet } from '../types';


export class BrandMultilingualFieldSetDto {
// export class BrandMultilingualFieldSetDto implements IBrandMultilingualFieldSet {
  // private brandTitleMaxLength: number;
  //
  // @ApiProperty({
  //   description: `Brand name. It must have length from ${COMPANY_NAME_MIN_LENGTH} to ${COMPANY_NAME_MAX_LENGTH} characters`,
  //   example: 'Mitsubishi Heavy Industries',
  // })
  // @IsString({ message: 'Full company name must be a string' })
  // @MaxLength(this.brandTitleMaxLength, {
  //   message: maxLengthStringMessage('Full company name', COMPANY_NAME_MAX_LENGTH),
  // })
  // @Matches(NAME_REGEXP, {
  //   message: 'Full company name can contain just latin symbols, digits, underscores and single quotes',
  // })
  // fullName?: string;
  //
  // shortName?: string;
  // title?: string;
  // shortDescription?: string;
  // description?: string;
  // keywords?: string;
}
