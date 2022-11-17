import { PickType } from '@nestjs/swagger';

import { VendorDto } from '../common/dto';


export class DeleteUserParamDto extends PickType(VendorDto, ['_id']) {}
