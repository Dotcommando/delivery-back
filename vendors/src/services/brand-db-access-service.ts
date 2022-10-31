import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { AddressedErrorCatching, ApplyAddressedErrorCatching } from '../common/decorators';
import { IBrand, IBrandDocument } from '../common/types';
import { mapIBrandDocumentToIBrand } from '../helpers';


@ApplyAddressedErrorCatching
@Injectable()
export class BrandDbAccessService {
  constructor(
    @InjectModel('Brand') private readonly brandModel: Model<IBrandDocument>,
  ) {
  }

  @AddressedErrorCatching()
  public async saveNewBrand(brand): Promise<{ brand: IBrand }> {
    const brandDoc: IBrandDocument = new this.brandModel({ ...brand });
    const savedBrandDoc: IBrandDocument = await brandDoc.save();

    return { brand: mapIBrandDocumentToIBrand(savedBrandDoc) };
  }
}
