import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { CreateBrandSuccessResponseDto } from '../dto';


export function CreateBrand() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Successful Brand creation.',
      type: CreateBrandSuccessResponseDto,
    }),
  );
}
