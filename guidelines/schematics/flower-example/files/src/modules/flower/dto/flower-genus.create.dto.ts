import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class FlowerGenusCreateDto {
  @ApiProperty({ description: 'Genus Name' })
  @IsString()
  @MaxLength(142)
  name: string;

  @ApiProperty({ description: 'Genus Description' })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  description: string;
}
