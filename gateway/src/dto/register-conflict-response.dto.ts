import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IResponse } from '../common/types';
import { ISignInRes } from '../types';


export class RegisterConflictResponseDto implements IResponse<ISignInRes> {
  @ApiProperty({ example: HttpStatus.CONFLICT })
  status: HttpStatus;

  @ApiProperty({
    example: null,
    nullable: true,
  })
  data: ISignInRes | null;

  @ApiProperty({
    example: [
      'Email vincent.specter@gmail.com occupied',
      'Error address: UsersService >> register',
    ],
    nullable: true,
  })
  errors: string[] | null;
}
