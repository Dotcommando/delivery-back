import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IResponse } from '../common/types';

class EmptyData { data: null; }

export class DeleteBrandNotFoundResponseDto extends EmptyData implements IResponse<null> {
  @ApiProperty({ example: HttpStatus.NOT_FOUND })
  status: HttpStatus | number;

  @ApiProperty({
    example: ['No brands with _id 6374bb44aff2de194aef08bb found'],
    nullable: true,
  })
  errors: string[] | null;
}
