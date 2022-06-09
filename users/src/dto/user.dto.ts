import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ObjectId, Types } from 'mongoose';

import { EMAIL_REGEXP, NAME_REGEXP, ROLE, ROLE_ARRAY, USERNAME_REGEXP } from '../common/constants';
import {
  maxLengthStringMessage,
  minLengthStringMessage,
  toArrayOfObjectIds,
  toBoolean,
  toObjectId,
} from '../common/helpers';
import { IUser } from '../common/interfaces';
import {
  ADDRESSES_MAX_SIZE,
  IMAGE_BASE64_MAX_LENGTH,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  ORDERS_MAX_SIZE,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PHONE_NUMBER_MAX_LENGTH,
  PHONE_NUMBER_MIN_LENGTH,
  PHONE_NUMBERS_MAX_SIZE,
  PROPERTY_LENGTH_64,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from '../constants';

export class UserDto implements IUser {
  @IsDefined()
  @Transform((data: TransformFnParams) => toObjectId({ value: data.value, key: data.key }))
  @Type(() => Types.ObjectId)
  _id: ObjectId;

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
  firstName: string;

  @IsString({ message: 'Middle name must be a string' })
  @IsOptional()
  @MaxLength(NAME_MAX_LENGTH, {
    message: maxLengthStringMessage('Middle name', NAME_MAX_LENGTH),
  })
  @Matches(NAME_REGEXP, {
    message: 'Middle name can contain just latin symbols, digits, underscores and single quotes',
  })
  middleName: string;

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
  lastName: string;

  @IsString({ message: 'Username must be a string' })
  @IsOptional()
  @MinLength(USERNAME_MIN_LENGTH, {
    message: minLengthStringMessage('Username', USERNAME_MIN_LENGTH),
  })
  @MaxLength(USERNAME_MAX_LENGTH, {
    message: maxLengthStringMessage('Username', USERNAME_MAX_LENGTH),
  })
  @Matches(USERNAME_REGEXP, {
    message: 'Username can contain just latin symbols, digits, and dots',
  })
  username: string;

  @IsString({ message: 'Email must be a string' })
  @MaxLength(PROPERTY_LENGTH_64, {
    message: `Email must be equal or shorter than ${PROPERTY_LENGTH_64} symbols`,
  })
  @Matches(EMAIL_REGEXP, {
    message: 'Email must be correct',
  })
  email: string;

  @IsOptional()
  @MaxLength(IMAGE_BASE64_MAX_LENGTH, {
    message: `Avatar must be equal or shorter ${Math.floor(Number(IMAGE_BASE64_MAX_LENGTH) / 1024)} Kbytes`,
  })
  avatar: string;

  @IsArray({ message: 'Addresses must be an array' })
  @ValidateNested({ each: true })
  @ArrayMaxSize(ADDRESSES_MAX_SIZE)
  @Transform(toArrayOfObjectIds('Addresses'))
  @Type(() => Types.ObjectId)
  addresses: ObjectId[];

  @IsArray({ message: 'Phone numbers must be an array' })
  @IsString({
    each: true,
    message: 'Each phone number must be a string',
  })
  @ArrayMaxSize(PHONE_NUMBERS_MAX_SIZE, {
    message: `Array of phone numbers must contain not more than ${PHONE_NUMBERS_MAX_SIZE} elements`,
  })
  @MinLength(PHONE_NUMBER_MIN_LENGTH, {
    each: true,
    message: `Minimal length for phone number is ${PHONE_NUMBER_MIN_LENGTH} symbols`,
  })
  @MaxLength(PHONE_NUMBER_MAX_LENGTH, {
    each: true,
    message: `Maximal length for phone number is ${PHONE_NUMBER_MAX_LENGTH} symbols`,
  })
  phoneNumbers: string[];

  @IsArray({ message: 'Roles must be an array' })
  @IsEnum(ROLE, {
    each: true,
    message: 'Each element of roles array must be valid value of the enum',
  })
  @ArrayMaxSize(ROLE_ARRAY.length - 1, {
    message: `User can not have role more than ${ROLE_ARRAY.length - 1} at the same time`,
  })
  roles: ROLE[];

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(ORDERS_MAX_SIZE)
  @Transform(toArrayOfObjectIds('Orders'))
  @Type(() => Types.ObjectId)
  orders: ObjectId[];

  @IsBoolean()
  @IsOptional()
  isConfirmed: boolean;

  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH, {
    message: minLengthStringMessage('Password', PASSWORD_MIN_LENGTH),
  })
  @MaxLength(PASSWORD_MAX_LENGTH, {
    message: maxLengthStringMessage('Password', PASSWORD_MAX_LENGTH),
  })
  password: string;

  @IsBoolean()
  @Transform(toBoolean)
  @IsOptional()
  deactivated: boolean;
}
