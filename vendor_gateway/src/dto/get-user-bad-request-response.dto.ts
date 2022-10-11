import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IAddress, IResponse, IVendor } from '../common/types';


export class GetUserBadRequestResponseDto implements IResponse<IVendor<IAddress>> {
  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  status: HttpStatus;

  @ApiProperty({ example: null, nullable: true })
  data: IVendor<IAddress> | null;

  @ApiProperty({
    example: ['_id is not a valid ObjectId'],
    nullable: true,
  })
  errors: string[] | null;
}
