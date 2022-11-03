import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';

import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsDefined, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Types } from 'mongoose';
import * as sanitizeHtml from 'sanitize-html';

import {
  POSTAL_CODE_MAX_LENGTH,
  POSTAL_CODE_MIN_LENGTH,
  POSTAL_CODE_REGEXP,
  PROPERTY_LENGTH_1,
  PROPERTY_LENGTH_4,
  PROPERTY_LENGTH_64,
} from '../constants';
import { NotNull, ValidateIfNull } from '../decorators';
import { maxLengthStringMessage, minLengthStringMessage, toObjectId } from '../helpers';
import { IAddress } from '../types';


export class AddressDto implements IAddress {
  @IsDefined()
  @Transform(toObjectId)
  @Type(() => Types.ObjectId)
  _id: Types.ObjectId;

  @IsDefined()
  @Transform(toObjectId)
  @Type(() => Types.ObjectId)
  userId: Types.ObjectId;

  @IsString({ message: 'Postal code must be a string' })
  @MinLength(PROPERTY_LENGTH_1, {
    message: minLengthStringMessage('Postal code', POSTAL_CODE_MIN_LENGTH),
  })
  @MaxLength(PROPERTY_LENGTH_64, {
    message: maxLengthStringMessage('Postal code', POSTAL_CODE_MAX_LENGTH),
  })
  @Matches(POSTAL_CODE_REGEXP, {
    message: 'Postal code can contain digits and hyphens only',
  })
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  postalCode: string;

  @IsString({ message: 'Country must be a string' })
  @MinLength(PROPERTY_LENGTH_1, {
    message: minLengthStringMessage('Country', PROPERTY_LENGTH_1),
  })
  @MaxLength(PROPERTY_LENGTH_64, {
    message: maxLengthStringMessage('Country', PROPERTY_LENGTH_64),
  })
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  country: string;

  @IsString({ message: 'Region must be a string' })
  @MaxLength(PROPERTY_LENGTH_64, {
    message: maxLengthStringMessage('Region', PROPERTY_LENGTH_64),
  })
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  region: string;

  @IsString({ message: 'City must be a string' })
  @MinLength(PROPERTY_LENGTH_1, {
    message: minLengthStringMessage('City', PROPERTY_LENGTH_1),
  })
  @MaxLength(PROPERTY_LENGTH_64, {
    message: maxLengthStringMessage('City', PROPERTY_LENGTH_64),
  })
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  city: string;

  @IsString({ message: 'Street must be a string' })
  @MinLength(PROPERTY_LENGTH_1, {
    message: minLengthStringMessage('Street', PROPERTY_LENGTH_1),
  })
  @MaxLength(PROPERTY_LENGTH_64, {
    message: maxLengthStringMessage('Street', PROPERTY_LENGTH_64),
  })
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  street: string;

  @IsString({ message: 'Building must be a string' })
  @MinLength(PROPERTY_LENGTH_1, {
    message: minLengthStringMessage('Building', PROPERTY_LENGTH_1),
  })
  @MaxLength(PROPERTY_LENGTH_64, {
    message: maxLengthStringMessage('Building', PROPERTY_LENGTH_64),
  })
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  building: string;

  @IsString({ message: 'Flat must be a string' })
  @MinLength(PROPERTY_LENGTH_1, {
    message: minLengthStringMessage('Flat', PROPERTY_LENGTH_1),
  })
  @MaxLength(PROPERTY_LENGTH_4, {
    message: maxLengthStringMessage('Flat', PROPERTY_LENGTH_4),
  })
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  flat: string;
}

export class PartialAddressDto extends PartialType(AddressDto) {}

export class AddAddressDto extends IntersectionType(
  PickType(AddressDto, [ 'city', 'street', 'building' ] as const),
  PickType(PartialAddressDto, [ 'postalCode', 'country', 'region', 'flat' ] as const),
) {}

export class UpdateAddressDto extends IntersectionType(
  PickType(AddressDto, ['_id'] as const),
  PickType(PartialAddressDto, [ 'postalCode', 'country', 'region', 'city', 'street', 'building', 'flat' ] as const),
) {
  @NotNull()
  @IsString({ message: 'Country must be a string. Cannot be null' })
  @MinLength(PROPERTY_LENGTH_1, {
    message: minLengthStringMessage('Country', PROPERTY_LENGTH_1),
  })
  @MaxLength(PROPERTY_LENGTH_64, {
    message: maxLengthStringMessage('Country', PROPERTY_LENGTH_64),
  })
  @ValidateIfNull()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  country: string;

  @NotNull()
  @IsString({ message: 'City must be a string. Cannot be null' })
  @MinLength(PROPERTY_LENGTH_1, {
    message: minLengthStringMessage('City', PROPERTY_LENGTH_1),
  })
  @MaxLength(PROPERTY_LENGTH_64, {
    message: maxLengthStringMessage('City', PROPERTY_LENGTH_64),
  })
  @ValidateIfNull()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  city: string;

  @NotNull()
  @IsString({ message: 'Street must be a string. Cannot be null' })
  @MinLength(PROPERTY_LENGTH_1, {
    message: minLengthStringMessage('Street', PROPERTY_LENGTH_1),
  })
  @MaxLength(PROPERTY_LENGTH_64, {
    message: maxLengthStringMessage('Street', PROPERTY_LENGTH_64),
  })
  @ValidateIfNull()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  street: string;

  @NotNull()
  @IsString({ message: 'Building must be a string. Cannot be null' })
  @MinLength(PROPERTY_LENGTH_1, {
    message: minLengthStringMessage('Building', PROPERTY_LENGTH_1),
  })
  @MaxLength(PROPERTY_LENGTH_64, {
    message: maxLengthStringMessage('Building', PROPERTY_LENGTH_64),
  })
  @ValidateIfNull()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  building: string;
}
