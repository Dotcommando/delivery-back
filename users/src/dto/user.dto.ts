import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ObjectId, Types } from 'mongoose';

import { EMAIL_REGEXP, NAME_REGEXP, ROLE, USERNAME_REGEXP } from '../common/constants';
import { maxLengthStringMessage, minLengthStringMessage, toObjectId } from '../common/helpers';
import { IUser } from '../common/interfaces';
import {
  IMAGE_BASE64_MAX_LENGTH,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
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

  @IsArray()
  @ValidateNested({ each: true })
  @Transform((data: TransformFnParams) => (data.value as string[])
    .map((objId) => toObjectId({ value: objId, key: 'One of elements of Addresses array' })),
  )
  @Type(() => Types.ObjectId)
  addresses: ObjectId[];

  phoneNumbers: string[];
  roles: ROLE[];
  orders: ObjectId[];
  isConfirmed: boolean;
  password: string;
  deactivated: boolean;
}
