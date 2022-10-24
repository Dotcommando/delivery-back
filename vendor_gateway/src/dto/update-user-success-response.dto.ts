import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IResponse } from '../common/types';
import { IUpdateVendorRes } from '../types';


export class UpdateUserSuccessResponseDto implements IResponse<IUpdateVendorRes> {
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
        addresses: [
          {
            _id: '62b1cfa3213655a4918adefc',
            userId: '62a9ef6adebb376060207f81',
            postalCode: '430024',
            country: 'Russia',
            city: 'Saransk',
            street: 'Kosarev',
            building: '39',
            flat: '125',
          },
          {
            _id: '62b1cfa3213655a4918adefd',
            userId: '62a9ef6adebb376060207f81',
            postalCode: '3906',
            country: 'Armenia',
            region: 'Tavush',
            city: 'Dilijan',
            street: 'Gai',
            building: '82',
            flat: '40',
          },
        ],
        phoneNumber: '+374 77 717-509',
        avatar: 'bipolar-bear-2022-10-24-11-51-02-606-3a01a0.jpeg',
        roles: [],
        orders: [],
        emailConfirmed: true,
        phoneConfirmed: true,
        deactivated: false,
      },
      fileData: {
        sessionUUID: 'c43b715e-5094-4995-9f2f-b794259800fc',
        fileName: 'mikhail-filchushkin-2022-10-24-12-53-04-097-9800fc.jpg',
      },
    },
    nullable: true,
  })
  data: IUpdateVendorRes | null;

  @ApiProperty({ example: null, nullable: true })
  errors: string[] | null;
}
