import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IResponse } from '../common/types';
import { FILE_TRANSFER_STATUS } from '../constants';
import { IGetAvatarDataRes } from '../types';


export class GetAvatarDataSuccessResponseDto implements IResponse<IGetAvatarDataRes> {
  @ApiProperty({ example: HttpStatus.OK })
  status: HttpStatus | number;

  @ApiProperty({
    example: {
      fileName: 'bipolar-bear-2022-10-24-11-51-02-606-3a01a0.jpeg',
      fileLink: 'https://specter-images.s3.eu-central-1.amazonaws.com/bipolar-bear-2022-10-24-11-51-02-606-3a01a0.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQND7VSKUKQ5MDAGG%2F20221024%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20221024T075115Z&X-Amz-Expires=259200&X-Amz-Signature=f5ac10a50ba96a74b20b2939b5bdb93bcb1eb73d00a68028c00d856b9cbd8f1b&X-Amz-SignedHeaders=host&x-id=GetObject',
      sessionUUID: '835f0e1c-ea52-4efd-acc0-6dfbf23a01a0',
      status: FILE_TRANSFER_STATUS.COMPLETED,
    },
  })
  data: IGetAvatarDataRes | null;

  @ApiProperty({ example: null })
  errors: string[] | null;
}
