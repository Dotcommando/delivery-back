import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IResponse } from '../common/types';
import { IVendorSignInRes } from '../types';


export class VendorRegisterConflictResponseDto implements IResponse<IVendorSignInRes> {
  @ApiProperty({ example: HttpStatus.CONFLICT })
  status: HttpStatus;

  @ApiProperty({
    example: null,
    nullable: true,
  })
  data: IVendorSignInRes | null;

  @ApiProperty({
    example: [
      'Email vincent.specter@gmail.com occupied',
      'Error address: UsersService >> register',
    ],
    nullable: true,
  })
  errors: string[] | null;
}
