import { IResponse } from './response.interface';


export interface ICombinableMethod<TRequest = { [args: string]: unknown }, TResponse = unknown> {
  (arg: TRequest): Promise<IResponse<TResponse>>;
}

export interface ICombineRequest<TReq = unknown[], TRes = any> {
  fn: ICombinableMethod<TReq, TRes>;
  args: TReq;
}
