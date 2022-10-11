import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IAddress, IResponse, IVendor } from '../common/types';


export class GetUserSuccessResponseDto implements IResponse<IVendor<IAddress>> {
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
        roles: [],
        orders: [],
        emailConfirmed: true,
        phoneConfirmed: true,
        deactivated: false,
      },
    },
    nullable: true,
  })
  data: IVendor<IAddress> | null;

  @ApiProperty({ example: null, nullable: true })
  errors: string[] | null;
}
