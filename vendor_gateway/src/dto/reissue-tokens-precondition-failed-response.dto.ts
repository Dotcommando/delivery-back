import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IResponse } from '../common/types';
import { IVendorSignInRes } from '../types';


export class ReissueTokensPreconditionFailedResponseDto implements IResponse<IVendorSignInRes> {
  @ApiProperty({ example: HttpStatus.PRECONDITION_FAILED })
  status: HttpStatus;

  @ApiProperty({
    example: null,
    nullable: true,
  })
  data: IVendorSignInRes | null;

  @ApiProperty({
    example: [
      'Unexpected token  in JSON at position 25',
      'Error address: UsersService >> reissueTokens',
    ],
    nullable: true,
  })
  errors: string[] | null;
}
