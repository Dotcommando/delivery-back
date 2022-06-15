import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IResponse } from '../common/types';
import { ISignInRes } from '../types';


export class ReissueTokensForbiddenResponseDto implements IResponse<ISignInRes> {
  @ApiProperty({ example: HttpStatus.FORBIDDEN })
  status: HttpStatus;

  @ApiProperty({
    example: null,
    nullable: true,
  })
  data: ISignInRes | null;

  @ApiProperty({
    example: ['Forbidden resource'],
    nullable: true,
  })
  errors: string[] | null;
}
