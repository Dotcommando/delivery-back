import { IntersectionType, PickType } from '@nestjs/swagger';

import { PartialVendorDto, VendorDto } from '../common/dto';


export class RegisterVendorBodyDto extends IntersectionType(
  PickType(VendorDto, [ 'firstName', 'lastName', 'email', 'password' ]),
  PickType(PartialVendorDto, [ 'middleName', 'phoneNumber' ]),
) {}
