import { IsUUID } from 'class-validator';


export class GetAvatarDataParamDto {
  @IsUUID('4', { message: 'Parameter sessionUUID must be a valid UUID' })
  sessionUUID: string;
}
