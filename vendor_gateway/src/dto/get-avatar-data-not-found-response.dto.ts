import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IResponse } from '../common/types';
import { IGetAvatarDataRes } from '../types';


export class GetAvatarDataNotFoundResponseDto implements IResponse<IGetAvatarDataRes> {
  @ApiProperty({ example: HttpStatus.NOT_FOUND })
  status: HttpStatus | number;

  @ApiProperty({ example: null })
  data: IGetAvatarDataRes | null;

  @ApiProperty({ example: ['No entries with UUID 835f0e1c-ea52-4efd-acc0-6dfbf23a01a0 found']})
  errors: string[] | null;
}
