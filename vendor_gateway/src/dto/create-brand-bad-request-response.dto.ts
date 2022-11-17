import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IBrand, IResponse } from '../common/types';
import { ICreateBrandRes } from '../types';


export class CreateBrandBadRequestResponseDto implements IResponse<ICreateBrandRes> {
  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  status: HttpStatus | number;

  @ApiProperty({ example: null })
  data: {
    brand: IBrand<string, string>;
  } | null;

  @ApiProperty({
    example: ['Language must be a value from list: ru, en, hy'],
    nullable: true,
  })
  errors: string[] | null;
}
