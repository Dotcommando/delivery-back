import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';

import {
  CommonForbiddenResponseDto,
  GetUserBadRequestResponseDto,
  GetUserNotFoundResponseDto,
  GetUserSuccessResponseDto,
} from '../dto';


export function GetUser() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Successful Get User response contains full user data.',
      type: GetUserSuccessResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'If such user not found',
      type: GetUserNotFoundResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'If some parameter is not valid',
      type: GetUserBadRequestResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'If the access token is expired.',
      type: CommonForbiddenResponseDto,
    }),
  );
}
