import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { plainToClass } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';
import { Strategy } from 'passport-local';

import { IResponse } from '../common/types';
import { SignInBodyDto } from '../dto';
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
    const signInData: SignInBodyDto = plainToClass(SignInBodyDto, { email, password });
    const errors: ValidationError[] = validateSync(signInData);

    if (errors.length) {
      let errorMessages = [];
      errors.forEach((error: ValidationError) => errorMessages = errorMessages.concat(Object.values(error.constraints)));

      throw new BadRequestException(errorMessages);
    }

    const validateUserResponse: IResponse<ISignInRes> = await this.authService.signIn(signInData);

    if (!validateUserResponse.data?.user) {
      throw new UnauthorizedException('No such pare of email and password found');
    }

    return validateUserResponse.data ?? null;
  }
}
