import { ROLE } from '../common/constants';
import { IUser } from '../common/types';


export const DEFAULT_USER_DATA: Omit<IUser, '_id'> = {
  firstName: '',
  lastName: '',
  email: '',
  avatar: '',
  addresses: [],
  phoneNumber: '',
  role: ROLE.USER,
  orders: [],
  emailConfirmed: false,
  phoneConfirmed: false,
  deactivated: false,
};
