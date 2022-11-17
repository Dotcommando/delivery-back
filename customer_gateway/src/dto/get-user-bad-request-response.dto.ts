import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IAddress, IResponse, IUser } from '../common/types';


export class GetUserBadRequestResponseDto implements IResponse<IUser<IAddress>> {
  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  status: HttpStatus;

  @ApiProperty({ example: null, nullable: true })
  data: IUser<IAddress> | null;

  @ApiProperty({
    example: ['_id is not a valid ObjectId'],
    nullable: true,
  })
  errors: string[] | null;
}
