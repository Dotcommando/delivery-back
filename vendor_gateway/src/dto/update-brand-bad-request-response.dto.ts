import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IBrand, IResponse } from '../common/types';
import { IUpdateBrandRes } from '../types';


export class UpdateBrandBadRequestResponseDto implements IResponse<IUpdateBrandRes> {
  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  status: HttpStatus | number;

  @ApiProperty({ example: null })
  data: {
    brand: IBrand<string, string>;
  } | null;

  @ApiProperty({
    example: ['Field \'shortDescription\' for language set \'ru\' exceeds the maximum number of characters allowed. Maximum number is 170, the field contains 2380'],
    nullable: true,
  })
  errors: string[] | null;
}
