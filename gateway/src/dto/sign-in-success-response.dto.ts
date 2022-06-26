import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IResponse } from '../common/types';
import { ISignInRes } from '../types';


export class SignInSuccessResponseDto implements IResponse<ISignInRes> {
  @ApiProperty({ example: HttpStatus.OK })
  status: HttpStatus;

  @ApiProperty({
    example: {
      user: {
        _id: '62a9ef6adebb376060207f81',
        firstName: 'Mikhail',
        middleName: 'Aleksandrovich',
        lastName: 'Filchushkin',
        username: 'Dotcommando',
        email: 'webestet@gmail.com',
        avatar: '',
        addresses: [],
        phoneNumber: '',
        roles: [],
        orders: [],
        emailConfirmed: false,
        phoneConfirmed: false,
        deactivated: false,
      },
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MmE5ZWY2YWRlYmIzNzYwNjAyMDdmODEiLCJhdWQiOiJodHRwczovL2pldGYuYW0iLCJpc3MiOiJodHRwczovL2pldGYuYW0iLCJhenAiOiJqZXRmLmFtIiwiZXhwIjoxNjU1MzA0MTAyOTA2LCJpYXQiOjE2NTUzMDQwNDI5MDYsImxvZ2luT3JpZ2luIjoidXNlcm5hbWVfcGFzc3dvcmQifQ.oSnj-dn9-Lh3dxB5Flc64hjeIJ13bSGw9RVIwqcUYb4',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MmE5ZWY2YWRlYmIzNzYwNjAyMDdmODEiLCJhdWQiOiJodHRwczovL2pldGYuYW0iLCJpc3MiOiJodHRwczovL2pldGYuYW0iLCJhenAiOiJqZXRmLmFtIiwiZXhwIjoxNjU1MzA0MTMyOTA2LCJpYXQiOjE2NTUzMDQwNDI5MDYsImxvZ2luT3JpZ2luIjoidXNlcm5hbWVfcGFzc3dvcmQifQ.iPufhT81NK0nLm7yx0LEWUH_fZ_-Tcvp1CVeG3zV4fU',
      accessTokenExpiredAfter: 1655304102906,
      refreshTokenExpiredAfter: 1655304132906,
    },
    nullable: true,
  })
  data: ISignInRes | null;

  @ApiProperty({ example: null, nullable: true })
  errors: string[] | null;
}
