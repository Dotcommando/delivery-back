import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IAddress, ICompany, IResponse, IVendor } from '../common/types';
import { IUpdateCompanyRes, IUpdateVendorRes } from '../types';


export class UpdateCompanyConflictResponseDto implements IResponse<| IUpdateCompanyRes | IUpdateVendorRes> {
  @ApiProperty({ example: HttpStatus.CONFLICT })
  status: HttpStatus | number;

  @ApiProperty({
    example: null,
  })
  data: {
    company: ICompany<string, IAddress<string, string>, string>;
    user: IVendor<IAddress>;
  } | null;

  @ApiProperty({
    example: [
      'E11000 duplicate key error collection: delivery-vendors.companies index: email_1 dup key: { email: \'info@mhi.com\' }',
      'Error address: CompaniesService >> createCompany',
    ],
    nullable: true,
  })
  errors: string[] | null;
}
