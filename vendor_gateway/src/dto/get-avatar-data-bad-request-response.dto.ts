import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IResponse } from '../common/types';
import { IGetAvatarDataRes } from '../types';


export class GetAvatarDataBadRequestResponseDto implements IResponse<IGetAvatarDataRes> {
  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  status: HttpStatus | number;

  @ApiProperty({ example: null })
  data: IGetAvatarDataRes | null;

  @ApiProperty({ example: ['Parameter sessionUUID must be a valid UUID']})
  errors: string[] | null;
}
