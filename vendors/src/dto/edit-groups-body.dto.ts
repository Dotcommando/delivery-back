import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

import { Transform, Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';

import { COMPANIES_MAX_SIZE, VENDOR_ROLE } from '../common/constants';
import { MembershipDto, VendorDto } from '../common/dto';
import { toArrayOfObjectIds } from '../common/helpers';


export class EditGroupsBodyDto extends PickType(VendorDto, ['_id'] as const) {
  @ApiProperty({
    example: [
      {
        role: VENDOR_ROLE.MANAGER,
        group: '62a9ef6adebb376060207f81',
      },
      {
        role: VENDOR_ROLE.MANAGER,
        group: '62aef38f2e1f95d77b347684',
      },
    ],
  })
  @IsOptional()
  @IsArray({ message: 'Field \'add\' must contain array of pairs of group Object Ids and vendor roles' })
  @ValidateNested({ each: true })
  @Type(() => MembershipDto)
  add: MembershipDto[];

  @ApiProperty({
    example: [
      {
        role: VENDOR_ROLE.OWNER,
        group: '62a9ef6adebb376060207f81',
      },
      {
        role: VENDOR_ROLE.OWNER,
        group: '62aef38f2e1f95d77b347684',
      },
    ],
  })
  @IsOptional()
  @IsArray({ message: 'Field \'update\' must contain array of pairs of group Object Ids and vendor roles' })
  @ValidateNested({ each: true })
  @Type(() => MembershipDto)
  update: MembershipDto[];

  @ApiProperty({
    example: [ '62a584a2f2fdd2cf95548236', '62a827c91774f165f8269257' ],
  })
  @IsOptional()
  @IsArray({ message: 'Field \'delete\' must contain array of groups (companies or brands) Object Ids' })
  @ValidateNested({ each: true })
  @ArrayMaxSize(COMPANIES_MAX_SIZE)
  @Transform(toArrayOfObjectIds('Delete'))
  @Type(() => Types.ObjectId)
  delete: Types.ObjectId[];
}
