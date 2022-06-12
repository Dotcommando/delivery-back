import { IToken } from '../common/types';

export type RefreshTokenData = Omit<IToken, '_id'>;
