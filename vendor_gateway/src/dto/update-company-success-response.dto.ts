import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IAddress, ICompany, IResponse, IVendor } from '../common/types';
import { IUpdateCompanyRes, IUpdateVendorRes } from '../types';


export class UpdateCompanySuccessResponseDto implements IResponse<| IUpdateCompanyRes | IUpdateVendorRes> {
  @ApiProperty({ example: HttpStatus.CREATED })
  status: HttpStatus | number;

  @ApiProperty({
    example: {
      company: {
        legalEntity: 'sole_proprietorship',
        fullName: 'Mitsubishi Heavy Industries',
        shortName: 'MHI',
        email: 'info@mhi.com',
        phoneNumber: '+1755755755',
        emailConfirmed: false,
        phoneConfirmed: false,
        bankData: 'Some bank data',
        _id: '63a81b6bdaf99aca4ad98f01',
        actualAddress: '62a584a2f2fdd2cf95548231',
        legalAddress: '62a584a2f2fdd2cf95548230',
        managers: [
          '63a70e8fb71f5d14759d7ea4',
        ],
      },
      user: {
        firstName: 'Adam',
        lastName: 'Jensen',
        email: 'a.jensen@gmail.com',
        avatar: '',
        role: 'user',
        phoneNumber: '',
        emailConfirmed: false,
        phoneConfirmed: false,
        deactivated: false,
        _id: '63a70e8fb71f5d14759d7ea4',
        addresses: [],
        companies: [
          {
            group: '63a81b6bdaf99aca4ad98f01',
            role: 'director',
          },
        ],
        brands: [],
      },
    },
  })
  data: {
    company: ICompany<string, IAddress<string, string>, string>;
    user: IVendor<IAddress>;
  } | null;

  @ApiProperty({ example: null, nullable: true })
  errors: string[] | null;
}
