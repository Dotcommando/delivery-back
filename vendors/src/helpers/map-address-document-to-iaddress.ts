import ObjectId from 'bson-objectid';

import { pickProperties } from '../common/helpers';
import { IAddress } from '../common/types';
import { IAddressDocument } from '../types';


export function mapAddressDocumentToIAddress(addressDoc: IAddressDocument | IAddress): IAddress {
  return {
    ...pickProperties(
      addressDoc,
      '_id',
      'userId',
      'postalCode',
      'country',
      'region',
      'city',
      'street',
      'building',
      'flat',
    ) as IAddress,
    _id: new ObjectId(String(addressDoc._id)),
  };
}
