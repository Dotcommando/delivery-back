import { Request } from 'express';

import { IVendor } from '../common/types';


export type AuthenticatedRequest = Request & {
  user: IVendor;
}
