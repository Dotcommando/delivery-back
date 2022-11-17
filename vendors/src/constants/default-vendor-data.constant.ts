import { ROLE } from '../common/constants';
import { IVendor } from '../common/types';


export const DEFAULT_VENDOR_DATA: Omit<IVendor, '_id'> = {
  firstName: '',
  lastName: '',
  email: '',
  avatar: '',
  role: ROLE.USER,
  addresses: [],
  companies: [],
  brands: [],
  phoneNumber: '',
  emailConfirmed: false,
  phoneConfirmed: false,
  deactivated: false,
  suspended: false,
};
