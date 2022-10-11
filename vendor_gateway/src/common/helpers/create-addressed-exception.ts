import { HttpException, HttpStatus } from '@nestjs/common';

import { MongoError } from 'mongodb';

import { AddressedHttpException } from '../exceptions';

export function createAddressedException(
  e: Error | HttpException | AddressedHttpException | MongoError,
  address: string,
): AddressedHttpException {
  throw new AddressedHttpException(
    (e as HttpException)?.getStatus ? (e as HttpException).getStatus() : HttpStatus.PRECONDITION_FAILED,
    address,
    process.env.ENVIRONMENT === 'prod'
      ? 'Some internal error happened'
      : e?.message && typeof e.message === 'string'
        ? e.message
        : String(e),
  );
}
