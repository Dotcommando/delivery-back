import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IResponse } from '../common/types';
import { ILogoutRes } from '../types';


export class LogoutSuccessResponseDto implements IResponse<ILogoutRes> {
  @ApiProperty({ example: HttpStatus.OK })
  status: HttpStatus;

  @ApiProperty({
    example: {
      user: {
        firstName: 'Mikhail',
        middleName: 'Aleksandrovich',
        lastName: 'Filchushkin',
        username: 'Dotcommando',
      },
    },
    nullable: true,
  })
  data: ILogoutRes | null;

  @ApiProperty({ example: null, nullable: true })
  errors: string[] | null;
}
