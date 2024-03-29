import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IAddress, IResponse, IUser } from '../common/types';


export class GetUserNotFoundResponseDto implements IResponse<IUser<IAddress>> {
  @ApiProperty({ example: HttpStatus.NOT_FOUND })
  status: HttpStatus;

  @ApiProperty({ example: null, nullable: true })
  data: IUser<IAddress> | null;

  @ApiProperty({
    example: [
      'Cannot find user with _id 62a9ef6adebb376060207f82',
      'Error address: UsersService >> getUser',
    ],
    nullable: true,
  })
  errors: string[] | null;
}
