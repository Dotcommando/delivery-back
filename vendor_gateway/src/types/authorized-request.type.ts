import { FastifyRequest } from 'fastify';

import { IVendorSignInRes } from './vendor-sign-in-res.interface';


export type AuthorizedRequest = FastifyRequest & {
  user: IVendorSignInRes | null;
}
