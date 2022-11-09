import { HttpStatus, Injectable } from '@nestjs/common';

import { AddressedErrorCatching, ApplyAddressedErrorCatching } from '../common/decorators';
import { detectSuccessfulResponseCode, pickProperties } from '../common/helpers';
import { ICombineRequest, IResponse } from '../common/types';


@ApplyAddressedErrorCatching
@Injectable()
export class CommonService {

  @AddressedErrorCatching()
  public async parallelCombineRequests<TReq1 = { [args: string]: any } | any[], TRes1 = any, TReq2 = { [args: string]: any }, TRes2 = any>(
    reqs: [
      ICombineRequest<TReq1, TRes1>,
      ICombineRequest<TReq2, TRes2>
    ],
  ): Promise<IResponse<| TRes1 | TRes2>> {
    const parallelRequestsResult: [Awaited<Promise<IResponse<TRes1>>>, Awaited<Promise<IResponse<TRes2>>>] = await Promise.all([
      reqs[0].fn(reqs[0].args),
      reqs[1].fn(reqs[1].args),
    ]);

    const firstFulfilled = detectSuccessfulResponseCode(parallelRequestsResult[0]);
    const secondFulfilled = detectSuccessfulResponseCode(parallelRequestsResult[1]);

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

  public async sequentialCombineRequests<
    TReq1,
    TRes1,
    TReq2,
    TRes2
  >(
    reqs: [
      ICombineRequest<TReq1, TRes1>,
      ICombineRequest<Partial<TReq2>, TRes2>
    ],
    keys: (keyof TRes1 & keyof TReq2)[],
  ): Promise<IResponse<TRes1 | TRes2>> {
    const firstRequestResult: IResponse<TRes1> = await reqs[0].fn(reqs[0].args);

    if (!detectSuccessfulResponseCode(firstRequestResult)) {
      return firstRequestResult as IResponse<| TRes1 | TRes2>;
    }

    const secondRequestResult: IResponse<TRes2> = await reqs[1]
      .fn({ ...reqs[1].args, ...pickProperties<TRes1>(firstRequestResult.data as TRes1, ...keys) } as TReq2);

    if (!detectSuccessfulResponseCode(secondRequestResult)) {
      return secondRequestResult as IResponse<| TRes1 | TRes2>;
    }

    return {
      status: firstRequestResult.status,
      data: {
        ...firstRequestResult.data,
        ...secondRequestResult.data,
      },
      errors: null,
    };
  }
}
