import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  readonly id: string;

  @IsDate()
  @Type(() => Date)
  readonly createdAt: Date;

  @IsString()
  readonly type: string;
}
