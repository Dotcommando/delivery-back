import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IResponse } from '../common/types';
import { IVendorSignInRes } from '../types';


export class SignInBadRequestResponseDto implements IResponse<IVendorSignInRes> {
  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  status: HttpStatus;

  @ApiProperty({
    example: null,
    nullable: true,
  })
  data: IVendorSignInRes | null;

  @ApiProperty({
    example: ['Email must be correct'],
    nullable: true,
  })
  errors: string[] | null;
}
