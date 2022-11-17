import { applyDecorators } from '@nestjs/common';
import { ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';

import {
  CommonForbiddenResponseDto,
  DeleteUserSuccessResponseDto,
} from '../dto';


export function DeleteVendor() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Successful Delete User response contains his name to say goodbye.',
      type: DeleteUserSuccessResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'If user is not found (unauthorized).',
      type: CommonForbiddenResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'If user tried to update anybody else (unauthorized).',
      type: CommonForbiddenResponseDto,
    }),
  );
}
