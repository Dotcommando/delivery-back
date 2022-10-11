import { Types } from 'mongoose';

import { mapAddressDocumentToIAddress } from './map-address-document-to-iaddress';

import { isValidObjectId, pickProperties } from '../common/helpers';
import { IAddress, IAddressDocument, IVendor, IVendorDocument } from '../common/types';


export function mapIVendorDocumentToIVendor<TAddress = Types.ObjectId, TCompany = Types.ObjectId, TBrand = Types.ObjectId>(userDoc: IVendorDocument<TAddress, TCompany, TBrand> | IVendor<TAddress, TCompany, TBrand>): IVendor<TAddress, TCompany, TBrand> {
  const clearedUser = pickProperties<IVendor<TAddress, TCompany, TBrand>>(
    userDoc as Partial<IVendor<TAddress, TCompany, TBrand>>,
    '_id',
    'firstName',
    'middleName',
    'lastName',
    'email',
    'avatar',
    'role',
    'addresses',
    'companies',
    'brands',
    'phoneNumber',
    'emailConfirmed',
    'phoneConfirmed',
    'deactivated',
    'suspended',
  );

  return clearedUser.addresses?.length && isValidObjectId(clearedUser.addresses[0] as any)
    ? clearedUser as unknown as IVendor<TAddress, TCompany, TBrand>
    : {
      ...clearedUser,
      addresses: clearedUser.addresses
        .map((addressDoc) => mapAddressDocumentToIAddress(addressDoc as unknown as IAddressDocument | IAddress)),
    } as unknown as IVendor<TAddress, TCompany, TBrand>;
}
