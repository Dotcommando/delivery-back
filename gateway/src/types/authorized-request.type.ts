import { FastifyRequest } from 'fastify';

import { IUserSafe } from '../common/interfaces';

export type AuthorizedRequest = FastifyRequest & {
  user: IUserSafe | null;
}
