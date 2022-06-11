import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-local';

import { IResponse } from '../common/interfaces';
import { AuthService } from '../services';
import { ISignInRes } from '../types';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passReqToCallback: false,
    });
  }

  async validate(email: string, password: string): Promise<ISignInRes | null> {
    const validateUserResponse: IResponse<ISignInRes> = await this.authService
      .signIn({ email, password });

    if (!validateUserResponse.data?.user) {
      throw new UnauthorizedException('No such pare of email and password found');
    }

    return validateUserResponse.data ?? null;
  }
}
