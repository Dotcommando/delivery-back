import { PickType } from '@nestjs/swagger';

import { VendorDto } from '../common/dto';


export class VendorSignInBodyDto extends PickType(VendorDto, [ 'email', 'password' ]) {}
