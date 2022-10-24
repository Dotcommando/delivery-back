import { applyDecorators } from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import {
  CommonForbiddenResponseDto,
  GetAvatarDataAcceptedResponseDto,
  GetAvatarDataBadRequestResponseDto,
  GetAvatarDataNotFoundResponseDto,
  GetAvatarDataSuccessResponseDto,
} from '../dto';


export function GetAvatarData() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Successful Update User response contains full user data.',
      type: GetAvatarDataSuccessResponseDto,
    }),
    ApiAcceptedResponse({
      description: 'If file uploading is in progress.',
      type: GetAvatarDataAcceptedResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'If some parameter is not valid.',
      type: GetAvatarDataBadRequestResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'If parameter sessionUUID not found in in-memory storage.',
      type: GetAvatarDataNotFoundResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'If the access token is expired.',
      type: CommonForbiddenResponseDto,
    }),
  );
}
