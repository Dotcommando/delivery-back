import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

import ObjectId from 'bson-objectid';
import { Transform, Type } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsObject,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

import {
  BANK_DATA_MAX_LENGTH,
  COMPANY_NAME_MAX_LENGTH,
  COMPANY_NAME_MIN_LENGTH,
  LEGAL_ENTITY,
  NAME_REGEXP,
  PHONE_NUMBER_MAX_LENGTH,
  PHONE_NUMBER_MIN_LENGTH,
  PROPERTY_LENGTH_64,
  VENDOR_ROLE,
} from '../common/constants';
import { CompanyDto } from '../common/dto';
import {
  maxLengthStringMessage,
  minLengthStringMessage,
  toLowercase,
  toObjectId,
} from '../common/helpers';

export class CreateCompanyDto extends OmitType(CompanyDto, [ '_id', 'emailConfirmed', 'phoneConfirmed', 'managers' ] as const) {
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
    description: 'Link on a legal address of the company. A valid MongoDB ObjectId',
    required: true,
    example: '62a588187cebf9ce17bea893',
  })
  @IsDefined()
  @Transform(toObjectId)
  @Type(() => ObjectId)
  legalAddress: ObjectId;

  @ApiProperty({
    description: 'Link on an actual address of the company. A valid MongoDB ObjectId',
    example: '62a588187cebf9ce17bea893',
  })
  @IsDefined()
  @Transform(toObjectId)
  @Type(() => ObjectId)
  actualAddress: ObjectId;

  @ApiProperty({
    description: 'Bank data of the company',
    required: true,
    example: 'ИНН 1326257236, КПП 132601001, ОГРН 1211300003320, Расчетный счет: 40702810210000864964, Банк: АО "ТИНЬКОФФ БАНК", ИНН банка: 7710140679, БИК банка: 044525974, Корреспондентский счет банка: 30101810145250000974',
  })
  @IsString({
    message: 'Bank data must be a string',
  })
  @MaxLength(BANK_DATA_MAX_LENGTH, {
    message: `Maximal length for the bank data is ${BANK_DATA_MAX_LENGTH} symbols`,
  })
  bankData: string;
}

export class CreateCompanyBodyDto {
  @ApiProperty({
    description: 'Company data',
    required: true,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateCompanyDto)
  company: CreateCompanyDto;

  @ApiProperty({
    description: 'Role of user in the company or brand',
    enum: VENDOR_ROLE,
    enumName: 'VENDOR_ROLE',
    example: VENDOR_ROLE.OWNER,
    required: false,
  })
  @IsEnum(VENDOR_ROLE, {
    message: 'The role must be a valid value of the enum',
  })
  role?: VENDOR_ROLE;
}
