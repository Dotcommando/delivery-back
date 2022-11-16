import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IResponse } from '../common/types';

class EmptyData { data: null; }

export class DeleteBrandSuccessResponseDto extends EmptyData implements IResponse<null> {
  @ApiProperty({ example: HttpStatus.OK })
  status: HttpStatus | number;

  @ApiProperty({ example: null, nullable: true })
  errors: string[] | null;
}
