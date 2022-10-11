import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IAddress, IResponse, IVendor } from '../common/types';


export class UpdateUserForbiddenResponseDto implements IResponse<IVendor<IAddress>> {
  @ApiProperty({ example: HttpStatus.FORBIDDEN })
  status: HttpStatus;

  @ApiProperty({ example: null, nullable: true })
  data: IVendor<IAddress> | null;

  @ApiProperty({
    example: ['You can update yourself only'],
    nullable: true,
  })
  errors: string[] | null;
}
