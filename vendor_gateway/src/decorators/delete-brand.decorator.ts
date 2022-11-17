import { applyDecorators } from '@nestjs/common';
import { ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';

import {
  CommonForbiddenResponseDto,
  DeleteBrandNotFoundResponseDto,
  DeleteBrandSuccessResponseDto,
} from '../dto';


export function DeleteBrand() {
  return applyDecorators(
    ApiOkResponse({
      description: 'If the brand successfully deleted',
      type: DeleteBrandSuccessResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'If brand with such _id not found',
      type: DeleteBrandNotFoundResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'If the access token is expired.',
      type: CommonForbiddenResponseDto,
    }),
  );
}
