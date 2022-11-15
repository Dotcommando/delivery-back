import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';

import { AddressedErrorCatching, ApplyAddressedErrorCatching } from '../common/decorators';
import { anyIdToMongoId } from '../common/helpers';
import { IBrand } from '../common/types';
import { applyTranslations, mapIBrandDocumentToIBrand } from '../helpers';
import { AnyId, IBrandDocument, IUpdateBrandReq } from '../types';


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
  public async findManyBrands(brandIds: Array<AnyId>): Promise<IBrand[] | null> {
    const ids = brandIds.map((brandId: AnyId): Types.ObjectId => anyIdToMongoId(brandId));
    const brandDocs: IBrandDocument[] = await this.brandModel.find({
      _id: { $in: ids },
    });

    if (!brandDocs || !brandDocs.length) {
      return null;
    }

    return brandDocs.map((brandDoc: IBrandDocument) => mapIBrandDocumentToIBrand(brandDoc));
  }

  public async findBrandById(brandId: AnyId): Promise<{ brand: IBrand | null }> {
    return { brand: (await this.findManyBrands([brandId]))?.[0] ?? null };
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
