import { IResponse } from '../types';


export function detectSuccessfulResponseCode(response: IResponse<any>): boolean {
  return Boolean(response.status)
    && response.status >= 200
    && response.status < 300;
}
