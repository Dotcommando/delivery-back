import { FastifyRequest } from 'fastify';

import { IUser } from '../common/types';


export type AuthenticatedRequest = FastifyRequest & {
  user: IUser;
}
