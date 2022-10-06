import { ApiProperty } from '@nestjs/swagger';

import { Transform, Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';

import { ADDRESSES_MAX_SIZE } from '../common/constants';
import { AddAddressDto, UpdateAddressDto } from '../common/dto';
import { toArrayOfObjectIds } from '../common/helpers';


export class EditAddressesBodyDto {
  @ApiProperty({
    example: [
      {
        city: 'Dilijan',
        street: 'Gai',
        building: '82',
        flat: '40',
      },
      {
        country: 'Russia',
        region: 'Mordovia',
        city: 'Saransk',
        street: 'Krasnoarmeyskaya',
        building: '17',
        flat: '94',
      },
    ],
  })
  @IsOptional()
  @IsArray({ message: 'Field \'add\' must contain array of user addresses to add' })
  @ValidateNested({ each: true })
  @Type(() => AddAddressDto)
  add: AddAddressDto[];

  @ApiProperty({
    example: [
      {
        _id: '62a584a2f2fdd2cf95548236',
        street: 'Shahumyan',
        building: '10',
        flat: '2',
      },
      {
        _id: '62a826ad1774f165f826923f',
        building: '40',
        flat: '125',
      },
    ],
  })
  @IsOptional()
  @IsArray({ message: 'Field \'add\' must contain array of user addresses to add' })
  @ValidateNested({ each: true })
  @Type(() => UpdateAddressDto)
  update: UpdateAddressDto[];

  @ApiProperty({
    example: [ '62a584a2f2fdd2cf95548236', '62a827c91774f165f8269257' ],
  })
  @IsOptional()
  @IsArray({ message: 'Field \'delete\' must contain array of user addresses ObjectIds to delete' })
  @ValidateNested({ each: true })
  @ArrayMaxSize(ADDRESSES_MAX_SIZE)
  @Transform(toArrayOfObjectIds('Delete'))
  @Type(() => Types.ObjectId)
  delete: Types.ObjectId[];
}
