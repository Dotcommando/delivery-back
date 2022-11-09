import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { AddressedErrorCatching, ApplyAddressedErrorCatching } from '../common/decorators';
import { IBrand } from '../common/types';
import { applyTranslations, mapIBrandDocumentToIBrand } from '../helpers';
import { IBrandDocument, IUpdateBrandReq } from '../types';


@ApplyAddressedErrorCatching
@Injectable()
export class BrandDbAccessService {
  constructor(
    @InjectModel('Brand') private readonly brandModel: Model<IBrandDocument>,
  ) {
  }

  @AddressedErrorCatching()
  public async saveNewBrand(brand: IBrand): Promise<{ brand: IBrand }> {
    const brandDoc: IBrandDocument = new this.brandModel({ ...brand });
    const savedBrandDoc: IBrandDocument = await brandDoc.save();

    return { brand: mapIBrandDocumentToIBrand(savedBrandDoc) };
  }

  @AddressedErrorCatching()
  public async updateBrand(brand: IUpdateBrandReq): Promise<{ brand: IBrand }> {
    const brandDoc: IBrandDocument = await this.brandModel.findOne({ _id: brand._id });

    for (const key in brand) {
      if (key !== 'translations') {
        if (brand[key] === null) {
          delete brandDoc[key];

          continue;
        }

        brandDoc[key] = brand[key];
      } else {
        brandDoc.translations = applyTranslations(brand.translations, brandDoc.translations);
      }
    }

    const saveResult = await brandDoc.save();

    return { brand: mapIBrandDocumentToIBrand(saveResult) };
  }
}
