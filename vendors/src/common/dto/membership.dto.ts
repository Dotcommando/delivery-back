import { ApiProperty } from '@nestjs/swagger';

import ObjectId from 'bson-objectid';
import { Transform, Type } from 'class-transformer';
import { IsDefined, IsEnum } from 'class-validator';

import { VENDOR_ROLE } from '../constants';
import { toObjectId } from '../helpers';
import { IMembership } from '../types';


export class MembershipDto implements IMembership {
  @ApiProperty({
    description: 'Role of user in the company or brand',
    enum: VENDOR_ROLE,
    enumName: 'VENDOR_ROLE',
    example: VENDOR_ROLE.OWNER,
  })
  @IsEnum(VENDOR_ROLE, {
    message: 'The role must be a valid value of the enum',
  })
  role: VENDOR_ROLE;

  @ApiProperty({
    description: 'It matches \'_id\' from collection \'companies\' or \'brands\' from DB. Valid MongoDB compatible ObjectId',
    required: true,
    example: '62a584a2f2fdd2cf95548236',
  })
  @IsDefined()
  @Transform(toObjectId)
  @Type(() => ObjectId)
  group: ObjectId;
}
