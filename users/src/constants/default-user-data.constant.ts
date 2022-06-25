import { IUser } from '../common/types';

export const DEFAULT_USER_DATA: Omit<IUser, '_id'> = {
  firstName: '',
  lastName: '',
  email: '',
  avatar: '',
  addresses: [],
  phoneNumber: '',
  roles: [],
  orders: [],
  emailConfirmed: false,
  phoneConfirmed: false,
  deactivated: false,
};
