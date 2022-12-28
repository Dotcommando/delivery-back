import ObjectId from 'bson-objectid';
import { Types } from 'mongoose';

import { mapAddressDocumentToIAddress } from './map-address-document-to-iaddress';
import { mapIBrandDocumentToIBrand } from './map-ibrand-document-to-ibrand';
import { mapICompanyDocumentToICompany } from './map-icompany-document-to-icompany';

import { isValidObjectId, pickProperties } from '../common/helpers';
import { IAddress, IBrand, ICompany, IMembership, IVendor } from '../common/types';
import { IAddressDocument, IBrandDocument, ICompanyDocument, IVendorDocument } from '../types';


export function mapIVendorDocumentToIVendor(userDoc: IVendorDocument<Types.ObjectId, Types.ObjectId, Types.ObjectId, Types.ObjectId>): IVendor<ObjectId, ObjectId, ObjectId, ObjectId>
export function mapIVendorDocumentToIVendor(userDoc: IVendorDocument<Types.ObjectId, IAddressDocument, Types.ObjectId, Types.ObjectId>): IVendor<ObjectId, IAddress, ObjectId, ObjectId>
export function mapIVendorDocumentToIVendor(userDoc: IVendorDocument<Types.ObjectId, IAddressDocument, ICompanyDocument, Types.ObjectId>): IVendor<ObjectId, IAddress, ICompany, ObjectId>
export function mapIVendorDocumentToIVendor(userDoc: IVendorDocument<Types.ObjectId, IAddressDocument, ICompanyDocument, IBrandDocument>): IVendor<ObjectId, IAddress, ICompany, IBrand>
export function mapIVendorDocumentToIVendor(userDoc: IVendorDocument<Types.ObjectId, Types.ObjectId, ICompanyDocument, IBrandDocument>): IVendor<ObjectId, ObjectId, ICompany, IBrand>
export function mapIVendorDocumentToIVendor(userDoc: IVendorDocument<Types.ObjectId, Types.ObjectId, Types.ObjectId, IBrandDocument>): IVendor<ObjectId, ObjectId, ObjectId, IBrand>
export function mapIVendorDocumentToIVendor(userDoc: IVendorDocument<Types.ObjectId, IAddressDocument, Types.ObjectId, IBrandDocument>): IVendor<ObjectId, IAddress, ObjectId, IBrand>
export function mapIVendorDocumentToIVendor(userDoc: IVendorDocument<Types.ObjectId, IAddressDocument | Types.ObjectId, ICompanyDocument | Types.ObjectId, IBrandDocument | Types.ObjectId>): IVendor<ObjectId, IAddress | ObjectId, ICompany | ObjectId, IBrand | ObjectId> {
  return {
    ...pickProperties<IVendorDocument<never, never, never, never>>(
      userDoc as Partial<IVendorDocument<never, never, never, never>>,
      'firstName',
      'middleName',
      'lastName',
      'email',
      'avatar',
      'role',
      'phoneNumber',
      'emailConfirmed',
      'phoneConfirmed',
      'deactivated',
      'suspended',
    ),
    _id: new ObjectId(String(userDoc._id)),
    addresses: userDoc.addresses?.some((address: IAddressDocument | Types.ObjectId) => isValidObjectId(address))
      ? userDoc.addresses.map((addressId: Types.ObjectId) => new ObjectId(String(addressId)))
      : userDoc.addresses.map((addressDoc: IAddressDocument) => mapAddressDocumentToIAddress(addressDoc)),
    companies: userDoc.companies?.some((company: IMembership<Types.ObjectId | ICompanyDocument>) => isValidObjectId(company.group))
      ? userDoc.companies.map((company: IMembership<Types.ObjectId>) => ({
        group: new ObjectId(String(company.group)),
        role: company.role,
      }))
      : userDoc.companies.map((company: IMembership<ICompanyDocument>) => ({
        group: mapICompanyDocumentToICompany(company.group),
        role: company.role,
      })),
    brands: userDoc.brands.some((brand: IMembership<Types.ObjectId | IBrandDocument>) => isValidObjectId(brand.group))
      ? userDoc.brands.map((brand: IMembership<Types.ObjectId>) => ({
        group: new ObjectId(String(brand.group)),
        role: brand.role,
      }))
      : userDoc.brands.map((brand: IMembership<IBrandDocument>) => ({
        group: mapIBrandDocumentToIBrand(brand.group),
        role: brand.role,
      })),
  } as IVendor<ObjectId, IAddress | ObjectId, ICompany | ObjectId, IBrand | ObjectId>;
}
