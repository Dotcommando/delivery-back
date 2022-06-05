import { HttpException, HttpStatus } from '@nestjs/common';

import { AddressedHttpException } from '../exceptions';

export function createAddressedException(address: string, e: Error | HttpException | AddressedHttpException): AddressedHttpException {
  throw new AddressedHttpException(
    address,
    e.message,
    (e as HttpException)?.getStatus ? (e as HttpException).getStatus() : HttpStatus.PRECONDITION_FAILED,
  );
}
