import { PartialType } from '@nestjs/swagger';

import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsDefined, IsString, MaxLength, MinLength } from 'class-validator';
import { Types } from 'mongoose';

import { JWT_MAX_TOKEN_LENGTH, JWT_MIN_TOKEN_LENGTH } from '../constants';
import { maxLengthStringMessage, minLengthStringMessage, toBoolean, toObjectId } from '../helpers';
import { IToken } from '../types';


export class TokenDto implements IToken {
  @IsDefined()
  @Transform((data: TransformFnParams) => toObjectId({ value: data.value, key: data.key }))
  @Type(() => Types.ObjectId)
  _id: Types.ObjectId;

  @IsDefined()
  @Transform((data: TransformFnParams) => toObjectId({ value: data.value, key: data.key }))
  @Type(() => Types.ObjectId)
  userId: Types.ObjectId;

  @IsString({ message: 'Access token must be a string' })
  @MinLength(JWT_MIN_TOKEN_LENGTH, {
    message: minLengthStringMessage('Access token', JWT_MIN_TOKEN_LENGTH),
  })
  @MaxLength(JWT_MAX_TOKEN_LENGTH, {
    message: maxLengthStringMessage('Access token', JWT_MAX_TOKEN_LENGTH),
  })
  accessToken: string;

  @IsString({ message: 'Refresh token must be a string' })
  @MinLength(JWT_MIN_TOKEN_LENGTH, {
    message: minLengthStringMessage('Refresh token', JWT_MIN_TOKEN_LENGTH),
  })
  @MaxLength(JWT_MAX_TOKEN_LENGTH, {
    message: maxLengthStringMessage('Refresh token', JWT_MAX_TOKEN_LENGTH),
  })
  refreshToken: string;

  @IsDefined()
  @Transform((data: TransformFnParams) => toObjectId({ value: data.value, key: data.key }))
  @Type(() => Types.ObjectId)
  issuedForUserAgent: Types.ObjectId;

  @IsDateString({ message: 'Issue date must be a Date string' })
  issuedAt: Date;

  @IsDateString({ message: 'Expiration date must be a Date string' })
  expiredAfter: Date;

  @IsBoolean()
  @Transform(toBoolean)
  blacklisted: boolean;
}

export class PartialTokenDto extends PartialType(TokenDto) {}
