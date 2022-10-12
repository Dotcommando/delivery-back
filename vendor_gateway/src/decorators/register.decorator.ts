import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiOkResponse } from '@nestjs/swagger';

import {
  VendorRegisterBadRequestResponseDto,
  VendorRegisterConflictResponseDto,
  VendorRegisterSuccessResponseDto,
} from '../dto';


export function Register() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Response is the same with success response for signing in, because we log in users immediately with registration.',
      type: VendorRegisterSuccessResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Response is the same with bad request response for signing in.',
      type: VendorRegisterBadRequestResponseDto,
    }),
    ApiConflictResponse({
      description: 'In case of such email is registered already.',
      type: VendorRegisterConflictResponseDto,
    }),
  );
}
