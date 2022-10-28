import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';

import { createHash } from 'crypto';
import { BulkWriteResult } from 'mongodb';
import { ClientSession, Model, Types } from 'mongoose';

import { BEARER_PREFIX, EMAIL_REGEXP, JWT_SECRET_KEY } from '../common/constants';
import { AddressedErrorCatching, ApplyAddressedErrorCatching } from '../common/decorators';
import { AddAddressDto, PartialTokenDto, PartialVendorDto, UpdateAddressDto } from '../common/dto';
import { pickProperties } from '../common/helpers';
import {
  IAddress,
  IAddressDocument,
  IBrand,
  IBrandDocument,
  IToken,
  ITokenDocument,
  IVendor,
  IVendorDocument,
} from '../common/types';
import { DEFAULT_VENDOR_DATA } from '../constants';
import {
  DeleteVendorBodyDto,
  EditAddressesBodyDto,
  EditGroupsBodyDto,
  UpdateVendorBodyDto,
} from '../dto';
import { mapIVendorDocumentToIVendor } from '../helpers';
import {
  IEmailPassword,
  ILogoutRes,
  IValidateVendorRes,
  RefreshTokenData,
} from '../types';


@ApplyAddressedErrorCatching
@Injectable()
export class DbAccessService {
  constructor(
    @InjectModel('Address') private readonly addressModel: Model<IAddressDocument>,
    @InjectModel('Brand') private readonly brandModel: Model<IBrandDocument>,
    @InjectModel('Token') private readonly tokenModel: Model<ITokenDocument>,
    @InjectModel('Vendor') private readonly vendorModel: Model<IVendorDocument>,
  ) {
  }

  public async getUserWithAddresses(_id: Types.ObjectId): Promise<IVendor<IAddress> | null> {
    const userDoc: IVendorDocument<IAddress> = (await this.vendorModel.aggregate([
      {
        $match: { _id },
      },
      {
        $lookup: {
          from: 'addresses',
          localField: 'addresses',
          foreignField: '_id',
          as: 'addresses',
        },
      },
    ]))?.[0];

    return userDoc ? mapIVendorDocumentToIVendor(userDoc) : null;
  }

  @AddressedErrorCatching()
  public async checkEmailOccupation(email: string): Promise<{ occupied: boolean }> {
    if (typeof email !== 'string' || !EMAIL_REGEXP.test(email)) {
      throw new BadRequestException('Email is not valid');
    }

    const userDoc = await this.vendorModel.findOne({ email });

    return { occupied: Boolean(userDoc) };
  }

  @AddressedErrorCatching()
  public async validateUser(user: IEmailPassword): Promise<IValidateVendorRes> {
    const emailDefined = 'email' in user;

    if (!emailDefined || !(user as IEmailPassword).email) {
      throw new BadRequestException('Something one required: email or username');
    }

    const userDoc: IVendorDocument = await this.vendorModel.findOne({
      ...{ email: (user as IEmailPassword).email },
    });

    const userIsValid = userDoc
      ? await userDoc.compareEncryptedPassword(user.password)
      : false;

    return {
      userIsValid,
      ...{ user: userDoc.toJSON() as IVendor },
    };
  }

  @AddressedErrorCatching()
  public async saveNewUser(user: PartialVendorDto): Promise<{ user: IVendor }> {
    const userDoc: IVendorDocument = new this.vendorModel({ ...DEFAULT_VENDOR_DATA, ...user });
    const savedUserDoc = await userDoc.save();

    return { user: savedUserDoc.toJSON() as IVendor };
  }

  public async saveRefreshToken(token: RefreshTokenData): Promise<{ saved: boolean }> {
    try {
      const newToken = new this.tokenModel(token);
      const saved = await newToken.save();

      return {
        saved: Boolean(saved),
      };
    } catch (e) {
      return {
        saved: false,
      };
    }
  }

  @AddressedErrorCatching()
  public async checkAccessToken(accessToken): Promise<{ blacklisted: boolean }> {
    const tokenDoc: ITokenDocument | null = await this.tokenModel
      .findOne({
        $or: [
          { accessToken: accessToken.replace(BEARER_PREFIX, '') },
          { refreshToken: this.encryptRefreshToken(accessToken) },
        ],
      });

    return {
      blacklisted: tokenDoc
        ? tokenDoc.blacklisted
        : false,
    };
  }

  @AddressedErrorCatching()
  public async findManyUsers(userIds: Array<string | Types.ObjectId>): Promise<IVendor[] | null> {
    const ids = userIds.map((userId: string | Types.ObjectId) => new Types.ObjectId(userId));
    const userDocs: IVendorDocument[] = await this.vendorModel.find({
      _id: { $in: ids },
    });

    if (!userDocs || !userDocs.length) {
      return null;
    }

    return userDocs.map((userDoc: IVendorDocument) => userDoc.toJSON());
  }

  public async findUserById(userId: string | Types.ObjectId): Promise<IVendor | null> {
    return (await this.findManyUsers([userId]))?.[0] ?? null;
  }

  @AddressedErrorCatching()
  private encryptRefreshToken(refreshToken: string): string {
    return createHash('sha256')
      .update(`${JWT_SECRET_KEY}:${refreshToken.replace(BEARER_PREFIX, '')}`)
      .digest('hex') ;
  }

  @AddressedErrorCatching()
  public async findRefreshToken(refreshToken: string): Promise<IToken | null> {
    const encryptedToken = this.encryptRefreshToken(refreshToken);

    const foundToken: ITokenDocument = await this.tokenModel.findOne({ refreshToken: encryptedToken });

    return foundToken ? foundToken.toJSON() as IToken : null;
  }

  @AddressedErrorCatching()
  public async updateToken(filter: PartialTokenDto, updates: PartialTokenDto): Promise<IToken> {
    const updatedFilter: PartialTokenDto = {
      ...filter,
      ...(filter?._id && { _id: new Types.ObjectId(filter._id) }),
      ...(filter?.refreshToken && { refreshToken: this.encryptRefreshToken(filter.refreshToken) }),
    };

    const updatedUpdates: PartialTokenDto = {
      ...updates,
      ...(updates?.accessToken && { accessToken: updates.accessToken.replace(BEARER_PREFIX, '') }),
    };

    const updatedToken: ITokenDocument | null = await this.tokenModel
      .findOneAndUpdate(updatedFilter, updatedUpdates, { returnDocument: 'after' });

    if (!updatedToken) {
      throw new NotFoundException('Token to update not found');
    }

    return updatedToken.toJSON() as IToken;
  }

  @AddressedErrorCatching()
  public async updateAddresses(
    addresses: UpdateAddressDto[],
    userId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<BulkWriteResult> {
    const updateAddressesQuery = [];

    addresses.forEach((addressUpdates: UpdateAddressDto) => {
      const updates: Partial<UpdateAddressDto> = pickProperties(
        addressUpdates,
        'postalCode', 'country', 'region', 'city', 'street', 'building', 'flat',
      );

      let areFieldsToUpdate = false;
      let areFieldsToRemove = false;
      const valuesToUnset = {};
      const valuesToSet = {};

      for (const field in updates) {
        if (updates[field] === null || updates[field] === undefined) {
          areFieldsToRemove = true;
          valuesToUnset[field] = '';
        } else {
          areFieldsToUpdate = true;
          valuesToSet[field] = updates[field];
        }
      }

      updateAddressesQuery.push({
        updateOne: {
          filter: {
            _id: new Types.ObjectId(addressUpdates._id),
            userId,
          },
          update: {
            ...(areFieldsToUpdate && {
              $set: valuesToSet,
            }),
            ...(areFieldsToRemove && {
              $unset: valuesToUnset,
            }),
          },
          upsert: false,
        },
      });
    });

    return await this.addressModel.bulkWrite(updateAddressesQuery, session ? { session } : {});
  }

  @AddressedErrorCatching()
  public async addAddresses(
    addresses: AddAddressDto[],
    userId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<[ PromiseSettledResult<IAddressDocument[]>, PromiseSettledResult<IVendorDocument> ]> {
    const addressesDocs = addresses.map((address: AddAddressDto) => new this.addressModel({
      ...address,
      userId,
    }));
    const opts = session ? { session, new: true } : { new: true };

    return await Promise.allSettled([
      this.addressModel.insertMany(addressesDocs, opts),
      this.vendorModel.findOneAndUpdate(
        { _id: userId },
        {
          $push: {
            addresses: addressesDocs.map((addressDoc) => addressDoc._id),
          },
        },
        opts,
      ),
    ]);
  }

  @AddressedErrorCatching()
  public async deleteAddresses(
    addresses: Types.ObjectId[],
    userId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<[ PromiseSettledResult<{ deletedCount: number }>, PromiseSettledResult<IVendorDocument> ]> {
    const opts = session ? { session, new: true } : { new: true };

    return await Promise.allSettled([
      this.addressModel.deleteMany({ userId, _id: { $in: addresses }}, opts),
      this.vendorModel.findOneAndUpdate(
        { _id: userId },
        {
          $pull: {
            addresses: { $in: addresses },
          },
        },
        opts,
      ),
    ]);
  }

  @AddressedErrorCatching()
  public async editAddresses(data: EditAddressesBodyDto, withSession = false): Promise<IVendor<IAddress> | null> {
    const session: ClientSession = withSession ? await this.vendorModel.startSession() : null;
    const userId = data._id;

    try {
      const queryOps = [];

      if (withSession) {
        session.startTransaction();
      }

      if (data.update?.length) {
        queryOps.push(this.updateAddresses([...data.update], userId, session));
      }

      if (data.add?.length) {
        queryOps.push(this.addAddresses([...data.add], userId, session));
      }

      if (data.delete?.length) {
        queryOps.push(this.deleteAddresses([...data.delete], userId, session));
      }

      await Promise.allSettled(queryOps);

      if (withSession) {
        await session.commitTransaction();
        await session.endSession();
      }
    } catch (e) {
      if (withSession) {
        await session.abortTransaction();
        await session.endSession();
      }

      return null;
    }

    return await this.getUserWithAddresses(userId);
  }

  @AddressedErrorCatching()
  public async updateUser(data: UpdateVendorBodyDto): Promise<IVendor<IAddress> | null> {
    const updates: Partial<UpdateVendorBodyDto> = pickProperties(
      data,
      'firstName', 'middleName', 'lastName', 'avatar', 'phoneNumber', 'email',
    );

    let areFieldsToUpdate = false;
    let areFieldsToRemove = false;
    const valuesToUnset = {};
    const valuesToSet = {};

    if ('email' in updates) {
      const checkEmailResult = await this.checkEmailOccupation(updates.email);

      if (checkEmailResult.occupied) {
        throw new ConflictException(`Email ${updates.email} already in use.`);
      }
    }

    for (const field in updates) {
      if (updates[field] === null || updates[field] === undefined) {
        areFieldsToRemove = true;
        valuesToUnset[field] = '';
      } else {
        areFieldsToUpdate = true;
        valuesToSet[field] = updates[field];

        if (field === 'email') {
          valuesToSet['emailConfirmed'] = false;
        } else if (field === 'phoneNumber') {
          valuesToSet['phoneConfirmed'] = false;
        }
      }
    }

    const updateUserDoc: IVendorDocument<IAddress> | null = await this.vendorModel.findOneAndUpdate(
      {
        _id: data._id,
      },
      {
        ...(areFieldsToUpdate && {
          $set: valuesToSet,
        }),
        ...(areFieldsToRemove && {
          $unset: valuesToUnset,
        }),
      },
      {
        new: true,
      },
    )
      .populate('addresses');

    return updateUserDoc ? mapIVendorDocumentToIVendor<IAddress>(updateUserDoc) : null;
  }

  @AddressedErrorCatching()
  public async deleteUser(data: DeleteVendorBodyDto): Promise<ILogoutRes> {
    const deletedUserResponse = await this.vendorModel.findByIdAndRemove(data._id);

    if (!deletedUserResponse) {
      return null;
    }

    return {
      user: {
        firstName: deletedUserResponse.firstName,
        ...(deletedUserResponse.middleName && { middleName: deletedUserResponse.middleName }),
        lastName: deletedUserResponse.lastName,
      },
    };
  }

  @AddressedErrorCatching()
  public async saveNewBrand(brand) {
    const brandDoc: IBrandDocument = new this.brandModel({ ...brand });
    const savedBrandDoc = await brandDoc.save();

    return { brand: savedBrandDoc.toJSON() as IBrand };
  }

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  private async removeExpiredTokens(): Promise<void> {
    await this.tokenModel.deleteMany({ expiredAfter: { $lt: new Date() }});
  }
}
