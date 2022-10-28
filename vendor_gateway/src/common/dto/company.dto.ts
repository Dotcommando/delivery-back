import { ApiProperty } from '@nestjs/swagger';

import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDefined,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength, ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';

import {
  BANK_DATA_MAX_LENGTH,
  COMPANY_NAME_MAX_LENGTH,
  COMPANY_NAME_MIN_LENGTH,
  LEGAL_ENTITY, MANAGER_NUMBER,
  NAME_REGEXP,
  PHONE_NUMBER_MAX_LENGTH,
  PHONE_NUMBER_MIN_LENGTH,
  PROPERTY_LENGTH_64,
} from '../constants';
import {
  maxLengthStringMessage,
  minLengthStringMessage, toArrayOfObjectIds,
  toLowercase,
  toObjectId,
} from '../helpers';
import { ICompany } from '../types';


export class CompanyDto implements ICompany {
  @IsDefined()
  @Transform(toObjectId)
  @Type(() => Types.ObjectId)
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'Legal entity of user\'s company',
    enum: LEGAL_ENTITY,
    enumName: 'LEGAL_ENTITY',
    example: LEGAL_ENTITY.SOLE_PROPRIETORSHIP,
  })
  @IsEnum(LEGAL_ENTITY, {
    message: 'The legal entity must be a valid value of the enum',
  })
  legalEntity: LEGAL_ENTITY;

  @ApiProperty({
    description: `The name of the company. It must have length from ${COMPANY_NAME_MIN_LENGTH} to ${COMPANY_NAME_MAX_LENGTH} characters`,
    required: true,
    example: 'Mitsubishi Heavy Industries',
  })
  @IsString({ message: 'Full company name must be a string' })
  @MinLength(COMPANY_NAME_MIN_LENGTH, {
    message: minLengthStringMessage('Full company name', COMPANY_NAME_MIN_LENGTH),
  })
  @MaxLength(COMPANY_NAME_MAX_LENGTH, {
    message: maxLengthStringMessage('Full company name', COMPANY_NAME_MAX_LENGTH),
  })
  @Matches(NAME_REGEXP, {
    message: 'Full company name can contain just latin symbols, digits, underscores and single quotes',
  })
  fullName: string;

  @ApiProperty({
    description: `The shorthand of the name of the company. It must have length from ${COMPANY_NAME_MIN_LENGTH} to ${COMPANY_NAME_MAX_LENGTH} characters. Can be equal to full name of the company if it can not be shortened`,
    required: true,
    example: 'MHI',
  })
  @IsString({ message: 'Short company name must be a string' })
  @MinLength(COMPANY_NAME_MIN_LENGTH, {
    message: minLengthStringMessage('Short company name', COMPANY_NAME_MIN_LENGTH),
  })
  @MaxLength(COMPANY_NAME_MAX_LENGTH, {
    message: maxLengthStringMessage('Short company name', COMPANY_NAME_MAX_LENGTH),
  })
  @Matches(NAME_REGEXP, {
    message: 'Short company name can contain just latin symbols, digits, underscores and single quotes',
  })
  shortName: string;

  @ApiProperty({
    description: 'Actual email of the company. Automatically converts to lowercase',
    required: true,
    example: 'info@mhi.com',
  })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({ message: 'Email must be correct' })
  @Transform(toLowercase)
  @MaxLength(PROPERTY_LENGTH_64, {
    message: `Email must be equal or shorter than ${PROPERTY_LENGTH_64} symbols`,
  })
  email: string;

  @ApiProperty({
    description: 'Actual phone number of the company',
    required: true,
    example: '+37477717509',
  })
  @IsString({
    message: 'Phone number must be a string',
  })
  @MinLength(PHONE_NUMBER_MIN_LENGTH, {
    message: `Minimal length for phone number is ${PHONE_NUMBER_MIN_LENGTH} symbols`,
  })
  @MaxLength(PHONE_NUMBER_MAX_LENGTH, {
    message: `Maximal length for phone number is ${PHONE_NUMBER_MAX_LENGTH} symbols`,
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'Is company email confirmed or not',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  emailConfirmed: boolean;

  @ApiProperty({
    description: 'Is company phone number confirmed or not',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  phoneConfirmed: boolean;

  @ApiProperty({
    description: 'Link on a legal address of the company. A valid MongoDB ObjectId',
    required: true,
    example: '62a588187cebf9ce17bea893',
  })
  @Transform(toObjectId)
  @Type(() => Types.ObjectId)
  legalAddress: Types.ObjectId;

  @ApiProperty({
    description: 'Link on an actual address of the company. A valid MongoDB ObjectId',
    example: '62a588187cebf9ce17bea893',
  })
  @Transform(toObjectId)
  @Type(() => Types.ObjectId)
  actualAddress: Types.ObjectId;

  @ApiProperty({
    description: 'Bank data of the company',
    required: true,
    example: 'ИНН 1326257236, КПП 132601001, ОГРН 1211300003320, Расчетный счет: 40702810210000864964, Банк: АО "ТИНЬКОФФ БАНК", ИНН банка: 7710140679, БИК банка: 044525974, Корреспондентский счет банка: 30101810145250000974',
  })
  @IsString({
    message: 'Bank data must be a string',
  })
  @MaxLength(PHONE_NUMBER_MAX_LENGTH, {
    message: `Maximal length for the bank data is ${BANK_DATA_MAX_LENGTH} symbols`,
  })
  bankData: string;

  @ApiProperty({
    description: 'List of ObjectIds of managers. Array of valid MongoDB compatible ObjectId',
    required: true,
    uniqueItems: true,
    example: [ '62a588187cebf9ce17bea893', '62a826ad1774f165f826923f' ],
  })
  @IsArray({ message: 'Managers must be an array' })
  @ValidateNested({ each: true })
  @ArrayMaxSize(MANAGER_NUMBER)
  @Transform(toArrayOfObjectIds('Managers'))
  @Type(() => Types.ObjectId)
  managers: Types.ObjectId[];
}
