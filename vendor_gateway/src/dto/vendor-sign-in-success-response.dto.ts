import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IResponse } from '../common/types';
import { IVendorSignInRes } from '../types';


export class VendorSignInSuccessResponseDto implements IResponse<IVendorSignInRes> {
  @ApiProperty({ example: HttpStatus.OK })
  status: HttpStatus;

  @ApiProperty({
    example: {
      user: {
        _id: '63468af7aa08c645949b76a3',
        firstName: 'Adam',
        lastName: 'Jensen',
        email: 'a.jensen@gmail.com',
        avatar: '',
        addresses: [],
        phoneNumber: '',
        role: 'user',
        companies: [],
        brands: [],
        emailConfirmed: false,
        phoneConfirmed: false,
        deactivated: false,
      },
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzQ2OGFmN2FhMDhjNjQ1OTQ5Yjc2YTMiLCJhdWQiOiJodHRwczovL2pldGYuYW0iLCJpc3MiOiJodHRwczovL2pldGYuYW0iLCJhenAiOiJqZXRmLmFtIiwiZXhwIjoxNjY1NTcxMDc5MjYxLCJpYXQiOjE2NjU1Njc0NzkyNjEsImxvZ2luT3JpZ2luIjoidXNlcm5hbWVfcGFzc3dvcmQifQ.mdRgbjNWgtKfV7DyMLiL5fsL2WgsCOWmGvzyMhVN6Jc',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzQ2OGFmN2FhMDhjNjQ1OTQ5Yjc2YTMiLCJhdWQiOiJodHRwczovL2pldGYuYW0iLCJpc3MiOiJodHRwczovL2pldGYuYW0iLCJhenAiOiJqZXRmLmFtIiwiZXhwIjoxNjY1NjUzODc5MjYxLCJpYXQiOjE2NjU1Njc0NzkyNjEsImxvZ2luT3JpZ2luIjoidXNlcm5hbWVfcGFzc3dvcmQifQ.1nLZ0tcWwMX9Q-AYw46tOfwJJe2yZbZYyotkSvxj8eM',
      accessTokenExpiredAfter: 1665571079261,
      refreshTokenExpiredAfter: 1665653879261,
    },
    nullable: true,
  })
  data: IVendorSignInRes | null;

  @ApiProperty({ example: null, nullable: true })
  errors: string[] | null;
}
