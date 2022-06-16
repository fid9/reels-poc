import { IsBoolean, IsString } from 'class-validator';

export class UserCreateDto {
  @IsString()
  readonly type: string;

  @IsBoolean()
  readonly isVerified: boolean;

  @IsString()
  readonly username: string;

  @IsString()
  readonly displayName: string;
}
