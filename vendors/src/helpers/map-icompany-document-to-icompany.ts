import ObjectId from 'bson-objectid';
import { Types } from 'mongoose';

import { mapAddressDocumentToIAddress } from './map-address-document-to-iaddress';
import { mapIVendorDocumentToIVendor } from './map-ivendor-document-to-ivendor';

import { isValidObjectId, pickProperties } from '../common/helpers';
import { IAddress, ICompany, IVendor } from '../common/types';
import { IAddressDocument, ICompanyDocument, IVendorDocument } from '../types';


export function mapICompanyDocumentToICompany(companyDoc: ICompanyDocument<Types.ObjectId, Types.ObjectId, Types.ObjectId>): ICompany<ObjectId, ObjectId, ObjectId>
export function mapICompanyDocumentToICompany(companyDoc: ICompanyDocument<Types.ObjectId, IAddressDocument, Types.ObjectId>): ICompany<ObjectId, IAddress, ObjectId>
export function mapICompanyDocumentToICompany(companyDoc: ICompanyDocument<Types.ObjectId, IAddressDocument, IVendorDocument>): ICompany<ObjectId, IAddress, IVendor>
export function mapICompanyDocumentToICompany(companyDoc: ICompanyDocument<Types.ObjectId, Types.ObjectId, IVendorDocument>): ICompany<ObjectId, ObjectId, IVendor>
export function mapICompanyDocumentToICompany(companyDoc: ICompanyDocument<Types.ObjectId, IAddressDocument | Types.ObjectId, IVendorDocument | Types.ObjectId>): ICompany<ObjectId, IAddress | ObjectId, IVendor | ObjectId> {
  return {
    ...pickProperties<ICompanyDocument<never, never, never>>(
      companyDoc as Partial<ICompanyDocument<never, never, never>>,
      'legalEntity',
      'fullName',
      'shortName',
      'email',
      'phoneNumber',
      'emailConfirmed',
      'phoneConfirmed',
      'bankData',
    ),
    _id: new ObjectId(String(companyDoc._id)),
    actualAddress: isValidObjectId(companyDoc.actualAddress)
      ? new ObjectId(String(companyDoc.actualAddress))
      : mapAddressDocumentToIAddress(companyDoc.actualAddress as IAddressDocument),
    legalAddress: isValidObjectId(companyDoc.legalAddress)
      ? new ObjectId(String(companyDoc.legalAddress))
      : mapAddressDocumentToIAddress(companyDoc.legalAddress as IAddressDocument),
    managers: companyDoc.managers?.some(manager => isValidObjectId(manager))
      ? companyDoc.managers.map((managerId: Types.ObjectId) => new ObjectId(String(managerId)))
      : companyDoc.managers.map((managerDoc: IVendorDocument) => mapIVendorDocumentToIVendor(managerDoc)),
  } as ICompany<ObjectId, IAddress | ObjectId, IVendor | ObjectId>;
}
