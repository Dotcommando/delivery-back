import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IResponse } from '../common/types';
import { FILE_TRANSFER_STATUS } from '../constants';
import { IGetAvatarDataRes } from '../types';


export class GetAvatarDataAcceptedResponseDto implements IResponse<IGetAvatarDataRes> {
  @ApiProperty({ example: HttpStatus.ACCEPTED })
  status: HttpStatus | number;

  @ApiProperty({
    example: {
      fileName: 'bipolar-bear-2022-10-24-11-51-02-606-3a01a0.jpeg',
      fileLink: null,
      sessionUUID: '835f0e1c-ea52-4efd-acc0-6dfbf23a01a0',
      status: FILE_TRANSFER_STATUS.TRANSFER,
    },
  })
  data: IGetAvatarDataRes | null;

  @ApiProperty({ example: null })
  errors: string[] | null;
}
