import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

import {
  VendorSignInBadRequestResponseDto,
  VendorSignInSuccessResponseDto,
  VendorSignInUnauthorizedResponseDto,
} from '../dto';


export function SignIn() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Regular response for a correct signing in.',
      type: VendorSignInSuccessResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'If some field has wrong value.',
      type: VendorSignInBadRequestResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'If values of field mismatch with their types. For example, if null received instead of string in \'password\' field.',
      type: VendorSignInUnauthorizedResponseDto,
    }),
  );
}
