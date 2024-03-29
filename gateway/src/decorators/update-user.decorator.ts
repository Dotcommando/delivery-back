import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiOkResponse } from '@nestjs/swagger';

import {
  UpdateUserBadRequestResponseDto,
  UpdateUserForbiddenResponseDto,
  UpdateUserSuccessResponseDto,
} from '../dto';


export function UpdateUser() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Successful Update User response contains full user data.',
      type: UpdateUserSuccessResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'If some parameter is not valid.',
      type: UpdateUserBadRequestResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'If the access token is expired.',
      type: UpdateUserForbiddenResponseDto,
    }),
  );
}
