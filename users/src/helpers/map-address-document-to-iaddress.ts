import { pickProperties } from '../common/helpers';
import { IAddress, IAddressDocument } from '../common/types';


export function mapAddressDocumentToIAddress(addressDoc: IAddressDocument | IAddress): IAddress {
  return pickProperties(
    addressDoc,
    '_id',
    'userId',
    'country',
    'region',
    'city',
    'street',
    'flat',
  ) as IAddress;
}
