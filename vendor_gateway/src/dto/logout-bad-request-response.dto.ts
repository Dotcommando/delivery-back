import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IResponse } from '../common/types';
import { ILogoutRes } from '../types';


export class LogoutBadRequestResponseDto implements IResponse<ILogoutRes> {
  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  status: HttpStatus;

  @ApiProperty({
    example: null,
    nullable: true,
  })
  data: ILogoutRes | null;

  @ApiProperty({
    example: [
      'Cannot find such refresh token',
      'Error address: UsersService >> logout',
    ],
    nullable: true,
  })
  errors: string[] | null;
}
