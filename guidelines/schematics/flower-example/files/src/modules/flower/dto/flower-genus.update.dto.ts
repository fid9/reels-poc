import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, IsNumber, IsOptional } from 'class-validator';

export class FlowerGenusUpdateDto {
  @ApiProperty({ description: 'Genus Name' })
  @IsString()
  @IsOptional()
  @MaxLength(142)
  name?: string;

  @ApiProperty({ description: 'Genus Description' })
  @IsString()
  @IsOptional()
  @MaxLength(512)
  description?: string;

  @ApiProperty({ description: 'Genus Version' })
  @IsNumber()
  version: number;
}
