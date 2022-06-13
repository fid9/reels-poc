import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  MaxLength,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsUUID,
} from 'class-validator';

import { FlowerGenusCreateDto } from '~modules/flower/dto/flower-genus.create.dto';

export class FlowerUpdateDto {
  @ApiProperty({ description: 'Flower Name' })
  @IsString()
  @MaxLength(142)
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Flower Description' })
  @IsString()
  @MaxLength(512)
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Genus Id' })
  @IsUUID()
  @IsOptional()
  genusId?: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => FlowerGenusCreateDto)
  @ApiProperty({ description: 'New Genus' })
  genus?: FlowerGenusCreateDto;

  @ApiProperty({ description: 'Flower Version' })
  @IsNumber()
  version: number;
}
