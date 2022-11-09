import { HttpStatus, Injectable, PreconditionFailedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BrandDbAccessService } from './brand-db-access-service';

import { AddressedErrorCatching } from '../common/decorators';
import { IBrand, IResponse } from '../common/types';
import { ICreateBrandRes, IUpdateBrandReq, IUpdateBrandRes } from '../types';


@Injectable()
export class BrandsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly brandDbAccessService: BrandDbAccessService,
  ) {
  }

  @AddressedErrorCatching()
  public async createBrand(data: IBrand): Promise<IResponse<ICreateBrandRes>> {
    const createBrandResponse: { brand: IBrand } = await this.brandDbAccessService.saveNewBrand(data);

    if (!createBrandResponse?.brand) {
      throw new PreconditionFailedException('Some internal error happened while creating the brand');
    }

    return {
      status: HttpStatus.CREATED,
      data: { brand: createBrandResponse.brand },
      errors: null,
    };
  }

  @AddressedErrorCatching()
  public async updateBrand(data: IUpdateBrandReq): Promise<IResponse<IUpdateBrandRes>> {
    const updateBrandResponse: { brand: IBrand } = await this.brandDbAccessService.updateBrand(data);

    if (!updateBrandResponse?.brand) {
      throw new PreconditionFailedException('Some internal error happened while updating the brand');
    }

    return {
      status: HttpStatus.OK,
      data: { brand: updateBrandResponse.brand },
      errors: null,
    };
  }
}
