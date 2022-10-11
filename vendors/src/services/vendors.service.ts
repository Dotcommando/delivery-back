import { BadRequestException, ConflictException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';

import { DbAccessService } from './db-access.service';

import { LOGIN_ORIGIN } from '../common/constants';
import { AddressedErrorCatching } from '../common/decorators';
import { PartialVendorDto } from '../common/dto';
import { IResponse, IVendor, IVendorDocument } from '../common/types';
import { RegisterVendorBodyDto, VendorSignInBodyDto } from '../dto';
import { IIssueTokensRes, IVendorSignInRes } from '../types';


@Injectable()
export class VendorsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private dbAccessService: DbAccessService,
    @InjectModel('Vendor') private readonly vendorModel: Model<IVendorDocument>,
  ) {
  }

  public async checkEmail(user: PartialVendorDto): Promise<{ occupied: boolean }> {
    return this.dbAccessService.checkEmailOccupation(user.email);
  }

  @AddressedErrorCatching()
  public async vendorRegister(user: RegisterVendorBodyDto): Promise<IResponse<{ user: IVendor }>> {
    const checkEmailResult = await this.checkEmail(user);

    if (checkEmailResult.occupied) {
      throw new ConflictException('Email already in use');
    }

    const newUserResponse: { user: IVendor } = await this.dbAccessService.saveNewUser(user);

    return {
      status: HttpStatus.CREATED,
      data: {
        user: newUserResponse.user,
      },
      errors: null,
    };
  }

  @AddressedErrorCatching()
  public async validateUser(user: VendorSignInBodyDto): Promise<IResponse<IValidateUserRes>> {
    if ((!('username' in user) && !('email' in user)) || (!user.username && !user.email)) {
      throw new BadRequestException('Something one required: email or username');
    }

    const validationResult: IValidateUserRes = await this.dbAccessService.validateUser(user as UserCredentialsReq);

    return {
      status: HttpStatus.OK,
      data: validationResult,
      errors: null,
    };
  }

  @AddressedErrorCatching()
  private issueToken(userId: string | Types.ObjectId, now: number, tokenType: 'refresh' | 'access' = 'access'): string {
    const options = { secret: this.configService.get('secretKey') };

    return this.jwtService.sign(
      {
        sub: String(userId),
        aud: this.configService.get('audience'),
        iss: this.configService.get('issuer'),
        azp: this.configService.get('authorizedParty'),
        exp: now + (tokenType === 'access' ? this.configService.get('accessTokenExpiresIn') : this.configService.get('refreshTokenExpiresIn')),
        iat: now,
        loginOrigin: LOGIN_ORIGIN.USERNAME_PASSWORD,
      },
      options,
    );
  }

  @AddressedErrorCatching()
  public async issueTokens(userId: string | Types.ObjectId): Promise<IIssueTokensRes> {
    const now = Date.now();
    const accessTokenExpiredAfter = now + this.configService.get('accessTokenExpiresIn');
    const refreshTokenExpiredAfter = now + this.configService.get('refreshTokenExpiresIn');
    const accessToken = this.issueToken(userId, now, 'access');
    const refreshToken = this.issueToken(userId, now, 'refresh');

    await this.dbAccessService.saveRefreshToken({
      userId: new Types.ObjectId(userId),
      refreshToken: refreshToken,
      issuedForUserAgent: new Types.ObjectId(),
      issuedAt: new Date(now),
      expiredAfter: new Date(refreshTokenExpiredAfter),
      blacklisted: false,
    });

    return {
      accessToken,
      refreshToken,
      accessTokenExpiredAfter,
      refreshTokenExpiredAfter,
    };
  }

  @AddressedErrorCatching()
  public async vendorSignIn(user: VendorSignInBodyDto): Promise<IResponse<IVendorSignInRes>> {
    const validateUserResponse = await this.validateUser(user);

    if (!validateUserResponse.data.userIsValid) {
      const emailIsDefined = 'email' in user;

      throw new UnauthorizedException(
        `User with such ${ emailIsDefined ? 'email' : 'username' } ${ emailIsDefined ? user.email : user.username } and password not found or password is wrong`,
      );
    }

    const validUser: IVendor = { ...validateUserResponse.data.user };
    const issueTokenResponse = await this.issueTokens(validUser._id);

    return {
      status: HttpStatus.OK,
      data: {
        user: validUser,
        ...issueTokenResponse,
      },
      errors: null,
    };
  }
}
