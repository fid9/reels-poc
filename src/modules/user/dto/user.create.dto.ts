import { IsString } from 'class-validator';

export class UserCreateDto {
  @IsString()
  type: string;

  @IsString()
  username: string;

  @IsString()
  displayName: string;
}
