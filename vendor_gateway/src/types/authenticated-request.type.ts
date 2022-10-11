import { FastifyRequest } from 'fastify';

import { IVendor } from '../common/types';


export type AuthenticatedRequest = FastifyRequest & {
  user: IVendor;
}
