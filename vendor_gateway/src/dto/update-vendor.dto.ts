import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

import {
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  NAME_REGEXP,
  PHONE_NUMBER_MAX_LENGTH,
  PHONE_NUMBER_MIN_LENGTH,
  PROPERTY_LENGTH_64,
} from '../common/constants';
import { NotNull, ValidateIfNull } from '../common/decorators';
import { PartialVendorDto } from '../common/dto';
import { maxLengthStringMessage, minLengthStringMessage, toLowercase } from '../common/helpers';


export class UpdateVendorDto extends PickType(
  PartialVendorDto,
  [
    'firstName',
    'middleName',
    'lastName',
    'phoneNumber',
    'email',
  ] as const,
) {
  @ApiProperty({
    description: `First name of user. It must have length from ${NAME_MIN_LENGTH} to ${NAME_MAX_LENGTH} characters. Cannot be null`,
    example: 'Ray',
    required: false,
  })
  @NotNull()
  @IsString({ message: 'First name must be a string' })
  @MinLength(NAME_MIN_LENGTH, {
    message: minLengthStringMessage('First name', NAME_MIN_LENGTH),
  })
  @MaxLength(NAME_MAX_LENGTH, {
    message: maxLengthStringMessage('First name', NAME_MAX_LENGTH),
  })
  @Matches(NAME_REGEXP, {
    message: 'First name can contain just latin symbols, digits, underscores and single quotes',
  })
  @ValidateIfNull()
  firstName: string;

  @ApiProperty({
    description: `Middle name of user. Optional. It must have length up to ${NAME_MAX_LENGTH} characters. Can be null`,
    example: 'Douglas',
    required: false,
  })
  @IsString({ message: 'Middle name must be a string' })
  @IsOptional()
  @MaxLength(NAME_MAX_LENGTH, {
    message: maxLengthStringMessage('Middle name', NAME_MAX_LENGTH),
  })
  @Matches(NAME_REGEXP, {
    message: 'Middle name can contain just latin symbols, digits, underscores and single quotes',
  })
  middleName: string;

  @ApiProperty({
    description: `Last name of user. It must have length from ${NAME_MIN_LENGTH} to ${NAME_MAX_LENGTH} characters. Cannot be null`,
    example: 'Bradbury',
    required: false,
  })
  @NotNull()
  @IsString({ message: 'Last name must be a string' })
  @MinLength(NAME_MIN_LENGTH, {
    message: minLengthStringMessage('Last name', NAME_MIN_LENGTH),
  })
  @MaxLength(NAME_MAX_LENGTH, {
    message: maxLengthStringMessage('Last name', NAME_MAX_LENGTH),
  })
  @Matches(NAME_REGEXP, {
    message: 'Last name can contain just latin symbols, digits, underscores and single quotes',
  })
  @ValidateIfNull()
  lastName: string;

  @ApiProperty({
    description: `It expects avatar image file with size up to ${Number(process.env.AVATAR_FILE_SIZE)} KBytes`,
    required: false,
  })
  @IsOptional()
  avatar: Buffer;

  @ApiProperty({
    description: 'User phone number. Cannot be null',
    example: '+37477717509',
    required: false,
  })
  @NotNull()
  @IsString({
    message: 'Phone number must be a string',
  })
  @MinLength(PHONE_NUMBER_MIN_LENGTH, {
    message: `Minimal length for phone number is ${PHONE_NUMBER_MIN_LENGTH} symbols`,
  })
  @MaxLength(PHONE_NUMBER_MAX_LENGTH, {
    message: `Maximal length for phone number is ${PHONE_NUMBER_MAX_LENGTH} symbols`,
  })
  @ValidateIfNull()
  phoneNumber: string;

  @ApiProperty({
    description: 'User\'s email. Automatically converts to lowercase. Cannot be null',
    example: 'ray.bradbury@gmail.com',
    required: false,
  })
  @NotNull()
  @IsString({ message: 'Email must be a string' })
  @IsEmail({ message: 'Email must be correct' })
  @Transform(toLowercase)
  @MaxLength(PROPERTY_LENGTH_64, {
    message: `Email must be equal or shorter than ${PROPERTY_LENGTH_64} symbols`,
  })
  @ValidateIfNull()
  email: string;
}
