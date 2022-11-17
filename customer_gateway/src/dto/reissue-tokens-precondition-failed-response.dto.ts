import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IResponse } from '../common/types';
import { ISignInRes } from '../types';


export class ReissueTokensPreconditionFailedResponseDto implements IResponse<ISignInRes> {
  @ApiProperty({ example: HttpStatus.PRECONDITION_FAILED })
  status: HttpStatus;

  @ApiProperty({
    example: null,
    nullable: true,
  })
  data: ISignInRes | null;

  @ApiProperty({
    example: [
      'Unexpected token  in JSON at position 25',
      'Error address: UsersService >> reissueTokens',
    ],
    nullable: true,
  })
  errors: string[] | null;
}
