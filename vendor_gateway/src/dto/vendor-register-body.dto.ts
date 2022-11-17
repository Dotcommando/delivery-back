import { IntersectionType, PickType } from '@nestjs/swagger';

import { PartialVendorDto, VendorDto } from '../common/dto';


export class VendorRegisterBodyDto extends IntersectionType(
  PickType(VendorDto, [ 'firstName', 'lastName', 'email', 'password' ]),
  PickType(PartialVendorDto, [ 'middleName', 'phoneNumber' ]),
) {}
