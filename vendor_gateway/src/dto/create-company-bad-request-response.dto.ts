import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IAddress, ICompany, IResponse, IVendor } from '../common/types';
import { ICreateCompanyRes, IUpdateVendorRes } from '../types';


export class CreateCompanyBadRequestResponseDto implements IResponse<| ICreateCompanyRes | IUpdateVendorRes> {
  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  status: HttpStatus | number;

  @ApiProperty({
    example: null,
  })
  data: {
    company: ICompany<string, IAddress<string, string>, string>;
    user: IVendor<IAddress>;
  } | null;

  @ApiProperty({
    example: ['company.The legal entity must be a valid value of the enum'],
    nullable: true,
  })
  errors: string[] | null;
}
