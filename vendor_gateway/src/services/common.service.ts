import { HttpStatus, Injectable } from '@nestjs/common';

import { AddressedErrorCatching, ApplyAddressedErrorCatching } from '../common/decorators';
import { ICombineRequest, IResponse } from '../common/types';


@ApplyAddressedErrorCatching
@Injectable()
export class CommonService {

  @AddressedErrorCatching()
  public async parallelCombineRequests<TReq1 = { [args: string]: any } | any[], TRes1 = any, TReq2 = { [args: string]: any }, TRes2 = any>(reqs: [ICombineRequest<TReq1, TRes1>, ICombineRequest<TReq2, TRes2>]): Promise<IResponse<| TRes1 | TRes2>> {
    const parallelRequestsResult: [Awaited<Promise<IResponse<TRes1>>>, Awaited<Promise<IResponse<TRes2>>>] = await Promise.all([
      reqs[0].fn(reqs[0].args),
      reqs[1].fn(reqs[1].args),
    ]);

    const firstFulfilled = Boolean(parallelRequestsResult[0].status)
      && parallelRequestsResult[0].status >= 200
      && parallelRequestsResult[0].status < 300;
    const secondFulfilled = Boolean(parallelRequestsResult[1].status)
      && parallelRequestsResult[1].status >= 200
      && parallelRequestsResult[1].status < 300;

    if (!firstFulfilled && !secondFulfilled) {
      return {
        status: HttpStatus.PRECONDITION_FAILED,
        data: null,
        errors: [
          'Both processes in parallel combine failed',
          ...(Array.isArray(parallelRequestsResult[0]?.errors)
            ? parallelRequestsResult[0].errors
            : []),
          ...(Array.isArray(parallelRequestsResult[1]?.errors)
            ? parallelRequestsResult[1].errors
            : []),
        ],
      };
    }

    if ((firstFulfilled && !secondFulfilled) || (!firstFulfilled && secondFulfilled)) {
      return {
        status: !firstFulfilled
          ? parallelRequestsResult[0].status
          : parallelRequestsResult[1].status,
        data: firstFulfilled
          ? parallelRequestsResult[0].data
          : parallelRequestsResult[1].data,
        errors: [
          ...(!firstFulfilled ? parallelRequestsResult[0]?.errors : parallelRequestsResult[1]?.errors),
        ],
      };
    }

    return {
      status: parallelRequestsResult[0].status,
      data: {
        ...parallelRequestsResult[0].data,
        ...parallelRequestsResult[1].data,
      },
      errors: null,
    };
  }
}
