import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import ObjectId from 'bson-objectid';
import { Model, Types } from 'mongoose';

import { VendorDbAccessService } from './vendor-db-access.service';

import { LOGIN_ORIGIN } from '../common/constants';
import { AddressedErrorCatching } from '../common/decorators';
import { PartialTokenDto, PartialVendorDto } from '../common/dto';
import { IAddress, IResponse, IToken, IVendor } from '../common/types';
import {
  DeleteVendorBodyDto,
  LogoutBodyDto,
  ReadVendorBodyDto,
  RegisterVendorBodyDto,
  ReissueTokensBodyDto,
  UpdateVendorBodyDto,
  VendorSignInBodyDto,
  VerifyAccessTokenBodyDto,
} from '../dto';
import {
  IEmailPassword,
  IIssueTokensRes,
  ILogoutRes,
  IValidateVendorRes,
  IVendorDocument,
  IVendorSignInRes,
  IVerifyTokenRes,
} from '../types';


@Injectable()
export class VendorsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private vendorDbAccessService: VendorDbAccessService,
    @InjectModel('Vendor') private readonly vendorModel: Model<IVendorDocument>,
  ) {
  }

  public async checkEmail(user: PartialVendorDto): Promise<{ occupied: boolean }> {
    return this.vendorDbAccessService.checkEmailOccupation(user.email);
  }

  @AddressedErrorCatching()
  public async vendorRegister(user: RegisterVendorBodyDto): Promise<IResponse<{ user: IVendor }>> {
    const checkEmailResult = await this.checkEmail(user);

    if (checkEmailResult.occupied) {
      throw new ConflictException('Email already in use');
    }

    const newUserResponse: { user: IVendor } = await this.vendorDbAccessService.saveNewUser(user);

    return {
      status: HttpStatus.CREATED,
      data: {
        user: newUserResponse.user,
      },
      errors: null,
    };
  }

  @AddressedErrorCatching()
  public async validateUser(user: VendorSignInBodyDto): Promise<IResponse<IValidateVendorRes>> {
    if (!('email' in user)) {
      throw new BadRequestException('Email required for user validation');
    }

    const validationResult: IValidateVendorRes = await this.vendorDbAccessService.validateUser(user as IEmailPassword);

    return {
      status: HttpStatus.OK,
      data: validationResult,
      errors: null,
    };
  }

  @AddressedErrorCatching()
  private issueToken(userId: string | Types.ObjectId | ObjectId, now: number, tokenType: 'refresh' | 'access' = 'access'): string {
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
  public async issueTokens(userId: string | Types.ObjectId | ObjectId): Promise<IIssueTokensRes> {
    const now = Date.now();
    const accessTokenExpiredAfter = now + this.configService.get('accessTokenExpiresIn');
    const refreshTokenExpiredAfter = now + this.configService.get('refreshTokenExpiresIn');
    const accessToken = this.issueToken(userId, now, 'access');
    const refreshToken = this.issueToken(userId, now, 'refresh');

    await this.vendorDbAccessService.saveRefreshToken({
      userId: new ObjectId(String(userId)),
      refreshToken: refreshToken,
      issuedForUserAgent: new ObjectId(),
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
      throw new UnauthorizedException(
        `User with such email ${ user.email } and password not found or password is wrong`,
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

  @AddressedErrorCatching()
  public async verifyAccessToken(data: VerifyAccessTokenBodyDto): Promise<IResponse<IVerifyTokenRes>> {
    const accessToken = this.jwtService.decode(data?.accessToken);

    if (!accessToken) {
      throw new BadRequestException('Access token can not be decoded');
    }

    if (accessToken['exp'] < Date.now()) {
      throw new BadRequestException('Access token expired');
    }

    const verified = Boolean(
      this.jwtService.verify(
        data.accessToken,
        { secret: this.configService.get('secretKey') },
      ),
    );

    if (!verified) {
      throw new UnauthorizedException('Access token is not genuine');
    }

    const checkTokenResult = await this.vendorDbAccessService.checkAccessToken(data.accessToken);

    if (checkTokenResult.blacklisted) {
      throw new UnauthorizedException('Access token is not genuine');
    }

    const userId = accessToken['sub'];
    const user = await this.vendorDbAccessService.findUserById(userId);

    if (!user) {
      throw new PreconditionFailedException(`Cannot get user by Id ${ userId }`);
    }

    return {
      status: HttpStatus.OK,
      data: {
        verified,
        user,
      },
      errors: null,
    };
  }

  public async reissueTokens(data: ReissueTokensBodyDto): Promise<IResponse<IIssueTokensRes>> {
    const accessToken = this.jwtService.decode(data?.accessToken);
    const refreshToken = this.jwtService.decode(data?.refreshToken);
    const userId = new ObjectId(refreshToken?.['sub']);

    if (!accessToken && refreshToken) {
      await this.vendorDbAccessService.updateToken({
        userId,
        refreshToken: data.refreshToken,
      }, {
        blacklisted: true,
      });

      throw new BadRequestException('Cannot decode Access token for reissuing');
    } else if (!accessToken && !refreshToken) {
      // If authentication works fine, there is unreachable code, because the user
      // got the access via valid refreshToken, which he used as accessToken.
      throw new BadRequestException('Cannot decode tokens for reissuing');
    } else if (accessToken && !refreshToken) {
      // The same.
      throw new BadRequestException('Cannot decode Refresh token for reissuing');
    }

    const getRefreshToken: IToken = await this.vendorDbAccessService.findRefreshToken(data.refreshToken);

    if (getRefreshToken.blacklisted) {
      // The same.
      throw new BadRequestException('Refresh token blacklisted');
    }

    if (!refreshToken?.['exp'] || (new Date(refreshToken?.['exp'])).getTime() < Date.now()) {
      await this.vendorDbAccessService.updateToken({
        userId,
        refreshToken: data.refreshToken,
      }, {
        accessToken: data.accessToken,
        blacklisted: true,
      } as PartialTokenDto);

      throw new BadRequestException('Refresh token is expired or has no expiration date');
    }

    const issueTokensRes: IIssueTokensRes = await this.issueTokens(userId);

    await this.vendorDbAccessService.updateToken({
      userId,
      refreshToken: data.refreshToken,
    }, {
      accessToken: data.accessToken,
      blacklisted: true,
    } as PartialTokenDto);

    return {
      status: HttpStatus.OK,
      data: issueTokensRes,
      errors: null,
    };
  }

  @AddressedErrorCatching()
  public async logout(data: LogoutBodyDto): Promise<IResponse<null>> {
    const findRefreshTokenResult: IToken | null = await this.vendorDbAccessService.findRefreshToken(data.refreshToken);

    if (!findRefreshTokenResult) {
      throw new BadRequestException('Cannot find such refresh token');
    }

    const decodedAccessToken = this.jwtService.decode(data.accessToken);

    if (!decodedAccessToken) {
      throw new BadRequestException('Cannot decode access token');
    }

    const updatedTokenResponse: IToken = await this.vendorDbAccessService.updateToken(
      { refreshToken: data.refreshToken },
      {
        accessToken: data.accessToken,
        blacklisted: true,
      },
    );

    return {
      status: HttpStatus.OK,
      data: null,
      errors: null,
    };
  }

  @AddressedErrorCatching()
  public async readVendor(data: ReadVendorBodyDto): Promise<IResponse<{ user: IVendor<ObjectId, IAddress> }>> {
    const user: IVendor<ObjectId, IAddress> | null = await this.vendorDbAccessService.getUserWithAddresses(data._id);

    if (!user) {
      throw new NotFoundException(`Cannot find user with _id ${data._id}`);
    }

    return {
      status: HttpStatus.OK,
      data: { user },
      errors: null,
    };
  }

  @AddressedErrorCatching()
  public async updateVendor(data: UpdateVendorBodyDto): Promise<IResponse<{ user: IVendor<ObjectId, IAddress> }>> {
    const user: IVendor<ObjectId, IAddress> | null = await this.vendorDbAccessService.updateUser(data);

    if (!user) {
      throw new NotFoundException(`Cannot find user with _id ${data._id} to update`);
    }

    return {
      status: HttpStatus.OK,
      data: { user },
      errors: null,
    };
  }

  @AddressedErrorCatching()
  public async deleteVendor(data: DeleteVendorBodyDto): Promise<IResponse<ILogoutRes>> {
    const deleteUserResponse: ILogoutRes | null = await this.vendorDbAccessService.deleteUser(data);

    return deleteUserResponse
      ? {
        status: HttpStatus.OK,
        data: deleteUserResponse,
        errors: null,
      }
      : {
        status: HttpStatus.NOT_FOUND,
        data: null,
        errors: [`User with id ${data._id} not found`],
      };
  }
}
