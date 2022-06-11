import { IToken } from '../common/interfaces';

export type RefreshTokenData = Omit<IToken, '_id'>;
