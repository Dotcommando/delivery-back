import { Types } from 'mongoose';

import { VENDOR_ROLE } from '../constants';
import { IMembership } from '../types';


export class MembershipDto implements IMembership {
  role: VENDOR_ROLE;
  group: Types.ObjectId;
}
