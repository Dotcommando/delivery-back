import { FastifyRequest } from 'fastify';

import { ISignInRes } from './sign-in-res.interface';


export type AuthorizedRequest = FastifyRequest & {
  user: ISignInRes | null;
}
