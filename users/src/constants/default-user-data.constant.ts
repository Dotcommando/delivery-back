import { IUser } from '../common/types';

export const DEFAULT_USER_DATA: Omit<IUser, '_id'> = {
  firstName: '',
  lastName: '',
  email: '',
  avatar: '',
  addresses: [],
  phoneNumbers: [],
  roles: [],
  orders: [],
  isConfirmed: false,
  deactivated: false,
};
