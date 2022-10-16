import { Request } from 'express';

import { IVendorSignInRes } from './vendor-sign-in-res.interface';


export type AuthorizedRequest = Request & {
  user: IVendorSignInRes | null;
}
