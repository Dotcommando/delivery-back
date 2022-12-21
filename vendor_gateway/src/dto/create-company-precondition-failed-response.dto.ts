import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IAddress, ICompany, IResponse, IVendor } from '../common/types';
import { ICreateCompanyRes, IUpdateVendorRes } from '../types';


export class CreateCompanyPreconditionFailedResponseDto implements IResponse<| ICreateCompanyRes | IUpdateVendorRes> {
  @ApiProperty({ example: HttpStatus.PRECONDITION_FAILED })
  status: HttpStatus | number;

  @ApiProperty({
    example: null,
  })
  data: {
    company: ICompany<string, IAddress<string, string>, string>;
    user: IVendor<IAddress>;
  } | null;

  @ApiProperty({
    example: ['Unknown error happened'],
    nullable: true,
  })
  errors: string[] | null;
}
