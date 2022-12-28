import { ApiProperty } from '@nestjs/swagger';

import ObjectId from 'bson-objectid';
import { Transform, Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsOptional, ValidateNested } from 'class-validator';

import { COMPANIES_MAX_SIZE } from '../common/constants';
import { toArrayOfObjectIds } from '../common/helpers';


export class UpdateManagersBodyDto {
  @ApiProperty({
    example: [ '62a584a2f2fdd2cf95548236', '62a827c91774f165f8269257' ],
  })
  @IsOptional()
  @IsArray({ message: 'Field \'add\' must contain array of managers ObjectIds to add' })
  @ArrayMaxSize(COMPANIES_MAX_SIZE)
  @Transform(toArrayOfObjectIds('Managers'))
  @Type(() => ObjectId)
  add: ObjectId[];

  @ApiProperty({
    example: [ '62a584a2f2fdd2cf95548236', '62a827c91774f165f8269257' ],
  })
  @IsOptional()
  @IsArray({ message: 'Field \'delete\' must contain array of managers ObjectIds to delete' })
  @ValidateNested({ each: true })
  @ArrayMaxSize(COMPANIES_MAX_SIZE)
  @Transform(toArrayOfObjectIds('Managers'))
  @Type(() => ObjectId)
  delete: ObjectId[];
}
