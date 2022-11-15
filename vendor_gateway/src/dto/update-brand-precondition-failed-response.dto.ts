import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IBrand, IResponse } from '../common/types';
import { IUpdateBrandRes } from '../types';


export class UpdateBrandPreconditionFailedResponseDto implements IResponse<IUpdateBrandRes> {
  @ApiProperty({ example: HttpStatus.PRECONDITION_FAILED })
  status: HttpStatus | number;

  @ApiProperty({ example: null })
  data: {
    brand: IBrand<string, string>;
  } | null;

  @ApiProperty({
    example: [
      'connect ECONNREFUSED 127.0.0.1:27038',
      'Error address: BrandDbAccessService >> updateBrand',
    ],
    nullable: true,
  })
  errors: string[] | null;
}
