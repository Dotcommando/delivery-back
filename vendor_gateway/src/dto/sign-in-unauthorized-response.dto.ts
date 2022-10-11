import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IResponse } from '../common/types';
import { IVendorSignInRes } from '../types';


export class SignInUnauthorizedResponseDto implements IResponse<IVendorSignInRes> {
  @ApiProperty({ example: HttpStatus.UNAUTHORIZED })
  status: HttpStatus;

  @ApiProperty({
    example: null,
    nullable: true,
  })
  data: IVendorSignInRes | null;

  @ApiProperty({
    example: ['Unauthorized'],
    nullable: true,
  })
  errors: string[] | null;
}
