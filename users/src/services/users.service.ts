import { Injectable } from '@nestjs/common';

import { Observable, of } from 'rxjs';

import { createAddressedException } from '../common/helpers';


@Injectable()
export class UsersService {
  public getHello(data): Observable<unknown> {
    try {
      return of({
        status: 200,
        data: 'Some expected data',
      });
    } catch (e) {
      createAddressedException('Users >> UsersService >> getHello', e);
    }
  }
}
