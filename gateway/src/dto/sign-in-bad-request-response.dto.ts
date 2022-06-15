import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IResponse } from '../common/types';
import { ISignInRes } from '../types';


export class SignInBadRequestResponseDto implements IResponse<ISignInRes> {
  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  status: HttpStatus;

  @ApiProperty({
    example: null,
    nullable: true,
  })
  data: ISignInRes | null;

  @ApiProperty({
    example: ['Email must be correct'],
    nullable: true,
  })
  errors: string[] | null;
}
