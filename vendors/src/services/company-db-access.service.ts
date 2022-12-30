import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import ObjectId from 'bson-objectid';
import { Model, Types } from 'mongoose';

import { AddressedErrorCatching, ApplyAddressedErrorCatching } from '../common/decorators';
import { anyIdToMongoId } from '../common/helpers';
import { ICompany } from '../common/types';
import { mapICompanyDocumentToICompany } from '../helpers';
import { IUpdateCompanyReq } from '../types';
import { AnyId, ICompanyDocument } from '../types';


@ApplyAddressedErrorCatching
@Injectable()
export class CompanyDbAccessService {
  constructor(
    @InjectModel('Company') private readonly companyModel: Model<ICompanyDocument>,
  ) {
  }

  @AddressedErrorCatching()
  public async saveNewCompany(company: ICompany): Promise<{ company: ICompany }> {
    const companyDoc: ICompanyDocument = new this.companyModel({
      ...company,
      _id: anyIdToMongoId(company._id),
      legalAddress: anyIdToMongoId(company.legalAddress),
      actualAddress: anyIdToMongoId(company.actualAddress),
      managers: company.managers?.map((id: ObjectId) => anyIdToMongoId(id)) ?? [],
    });
    const savedCompanyDoc: ICompanyDocument = await companyDoc.save();

    return { company: mapICompanyDocumentToICompany(savedCompanyDoc) };
  }

  @AddressedErrorCatching()
  public async findManyCompanies(companyIds: Array<AnyId>): Promise<ICompany[] | null> {
    const ids = companyIds.map((companyId: AnyId): Types.ObjectId => anyIdToMongoId(companyId));
    const companyDocs: ICompanyDocument[] = await this.companyModel.find({
      _id: { $in: ids },
    });

    if (!companyDocs || !companyDocs.length) {
      return null;
    }

    return companyDocs.map((companyDoc: ICompanyDocument) => mapICompanyDocumentToICompany(companyDoc));
  }

  public async findCompanyById(companyId: AnyId): Promise<{ company: ICompany | null }> {
    return { company: (await this.findManyCompanies([companyId]))?.[0] ?? null };
  }

  @AddressedErrorCatching()
  public async updateCompany({ _id, company }: IUpdateCompanyReq): Promise<{ company: ICompany }> {
    const companyDoc: ICompanyDocument = await this.companyModel.findOne({ _id });

    if (!companyDoc) {
      throw new NotFoundException(`No companies with _id ${_id} found`);
    }

    for (const key in company) {
      if (company[key] === null) {
        delete companyDoc[key];

        continue;
      }

      companyDoc[key] = company[key];
    }

    const saveResult = await companyDoc.save();

    return { company: mapICompanyDocumentToICompany(saveResult) };
  }

  @AddressedErrorCatching()
  public async deleteCompany(data: { _id: AnyId }): Promise<void> {
    const deleteCompanyResponse = await this.companyModel.deleteOne({ _id: anyIdToMongoId(data._id) });

    if (deleteCompanyResponse.deletedCount !== 1) {
      throw new NotFoundException(`No companies with _id ${data._id} found`);
    }

    return;
  }
}
