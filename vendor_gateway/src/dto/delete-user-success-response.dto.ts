import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IResponse } from '../common/types';
import { IDeleteUserRes } from '../types';


export class DeleteUserSuccessResponseDto implements IResponse<IDeleteUserRes> {
  @ApiProperty({ example: HttpStatus.OK })
  status: HttpStatus | number;

  @ApiProperty({
    example: {
      firstName: 'Adam',
      lastName: 'Jensen',
    },
  })
  data: IDeleteUserRes | null;

  errors: string[] | null;
}
