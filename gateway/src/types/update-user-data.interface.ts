import { Types } from 'mongoose';

import { IUser } from '../common/types';
import { UpdateUserBodyDto } from '../dto';


export interface IUpdateUserData {
  body: UpdateUserBodyDto;
  _id: Types.ObjectId;
  user?: IUser | null;
}
