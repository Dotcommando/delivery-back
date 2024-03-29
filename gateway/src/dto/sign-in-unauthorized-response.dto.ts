import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IResponse } from '../common/types';
import { ISignInRes } from '../types';


export class SignInUnauthorizedResponseDto implements IResponse<ISignInRes> {
  @ApiProperty({ example: HttpStatus.UNAUTHORIZED })
  status: HttpStatus;

  @ApiProperty({
    example: null,
    nullable: true,
  })
  data: ISignInRes | null;

  @ApiProperty({
    example: ['Unauthorized'],
    nullable: true,
  })
  errors: string[] | null;
}
