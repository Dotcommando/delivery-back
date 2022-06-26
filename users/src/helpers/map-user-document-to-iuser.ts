import { Types } from 'mongoose';

import { mapAddressDocumentToIAddress } from './map-address-document-to-iaddress';

import { isValidObjectId, pickProperties } from '../common/helpers';
import { IAddress, IAddressDocument, IUser, IUserDocument } from '../common/types';


export function mapUserDocumentToIUser<TAddress = Types.ObjectId, TOrder = Types.ObjectId>(userDoc: IUserDocument<TAddress, TOrder> | IUser<TAddress, TOrder>): IUser<TAddress, TOrder> {
  const clearedUser= pickProperties<IUser<TAddress, TOrder>>(
    userDoc as Partial<IUser<TAddress, TOrder>>,
    '_id',
    'firstName',
    'middleName',
    'lastName',
    'username',
    'email',
    'avatar',
    'addresses',
    'phoneNumber',
    'roles',
    'orders',
    'emailConfirmed',
    'phoneConfirmed',
    'deactivated',
  );

  return clearedUser.addresses?.length && isValidObjectId(clearedUser.addresses[0] as any)
    ? clearedUser as unknown as IUser<TAddress, TOrder>
    : {
      ...clearedUser,
      addresses: clearedUser.addresses
        .map((addressDoc) => mapAddressDocumentToIAddress(addressDoc as unknown as IAddressDocument | IAddress)),
    } as unknown as IUser<TAddress, TOrder>;
}
