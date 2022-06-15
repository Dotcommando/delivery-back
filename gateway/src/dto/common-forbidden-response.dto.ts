import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IResponse } from '../common/types';


export class CommonForbiddenResponseDto implements IResponse<any> {
  @ApiProperty({ example: HttpStatus.FORBIDDEN })
  status: HttpStatus;

  @ApiProperty({
    example: null,
    nullable: true,
  })
  data: any | null;

  @ApiProperty({
    example: ['Forbidden resource'],
    nullable: true,
  })
  errors: string[] | null;
}
