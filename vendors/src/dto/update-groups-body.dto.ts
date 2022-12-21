import { ApiProperty } from '@nestjs/swagger';

import ObjectId from 'bson-objectid';
import { Transform, Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsOptional, ValidateNested } from 'class-validator';

import { COMPANIES_MAX_SIZE, VENDOR_ROLE } from '../common/constants';
import { MembershipDto } from '../common/dto';
import { toArrayOfObjectIds } from '../common/helpers';


export class UpdateGroupsBodyDto {
  @ApiProperty({
    example: [
      {
        role: VENDOR_ROLE.OWNER,
        group: '62a584a2f2fdd2cf95548236',
      },
      {
        role: VENDOR_ROLE.DEPUTY_DIRECTOR,
        group: '62a584a2f2fdd2cf95548237',
      },
    ],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Field \'add\' must contain array of pairs roles and companies or brands (field \'group\') ObjectIds' })
  @ValidateNested({ each: true })
  @ArrayMaxSize(COMPANIES_MAX_SIZE)
  @Type(() => MembershipDto)
  add?: MembershipDto[];

  @ApiProperty({
    example: [
      {
        role: VENDOR_ROLE.OWNER,
        group: '62a584a2f2fdd2cf95548236',
      },
      {
        role: VENDOR_ROLE.DEPUTY_DIRECTOR,
        group: '62a584a2f2fdd2cf95548237',
      },
    ],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Field \'update\' must contain array of pairs roles and companies or brands (field \'group\') ObjectIds' })
  @ValidateNested({ each: true })
  @ArrayMaxSize(COMPANIES_MAX_SIZE)
  @Type(() => MembershipDto)
  update?: MembershipDto[];

  @ApiProperty({
    example: [ '62a584a2f2fdd2cf95548236', '62a827c91774f165f8269257' ],
    uniqueItems: true,
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Field \'delete\' must contain array of companies or brands ObjectIds to delete' })
  @ArrayMaxSize(COMPANIES_MAX_SIZE)
  @Transform(toArrayOfObjectIds('Delete'))
  @Type(() => ObjectId)
  delete?: ObjectId[];
}
