import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-local';

import { IResponse, IUserSafe } from '../common/interfaces';
import { AuthService } from '../services';
import { IValidateUserRes } from '../types';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passReqToCallback: false,
    });
  }

  async validate(email: string, password: string): Promise<IUserSafe | null> {
    const validateUserResponse: IResponse<IValidateUserRes> = await this.authService
      .validateUser({ email, password });

    if (!validateUserResponse.data?.userIsValid) {
      throw new UnauthorizedException('No such pare of email and password found');
    }

    return validateUserResponse.data?.user ?? null;
  }
}
