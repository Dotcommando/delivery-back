import { Schema } from 'mongoose';

import { VENDOR_ROLE, VENDOR_ROLE_ARRAY } from '../common/constants';


export const MembershipSchema = new Schema({
  group: {
    type: Schema.Types.ObjectId,
    index: true,
  },
  role: {
    type: String,
    default: VENDOR_ROLE.OWNER,
    enum: [...VENDOR_ROLE_ARRAY],
    index: true,
  },
});
