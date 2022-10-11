import { Schema } from 'mongoose';

import { VENDOR_ROLE } from '../common/constants';


export const MembershipSchema = new Schema({
  group: {
    type: Schema.Types.ObjectId,
    index: true,
  },
  role: {
    type: String,
    default: VENDOR_ROLE.OWNER,
    enum: [
      VENDOR_ROLE.ADMIN,
      VENDOR_ROLE.OWNER,
      VENDOR_ROLE.MANAGER,
      VENDOR_ROLE.OPERATOR,
      VENDOR_ROLE.DELIVERYMAN,
    ],
    index: true,
  },
});
