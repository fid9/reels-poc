import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { FlowerEntity } from '~database/entities';

import { FlowerGenusShortDto } from '~modules/flower/dto/flower-genus.short.dto';

export class FlowerDetailDto {
  @ApiPropertyOptional({ description: 'Flower Id' })
  @IsString()
  public readonly id: string;

  @ApiPropertyOptional({ description: 'Flower Name' })
  @IsBoolean()
  public readonly name: string;

  @ApiPropertyOptional({ description: 'Flower Description' })
  @IsBoolean()
  public readonly description: string;

  @ApiPropertyOptional({ description: 'Flower Created At' })
  @IsDate()
  @Type(() => Date)
  public readonly createdDate: Date;

  @ApiPropertyOptional({ description: 'Flower Updated At' })
  @IsDate()
  @Type(() => Date)
  public readonly updatedDate: Date;

  @ApiPropertyOptional({ description: 'Entity Version' })
  @IsDate()
  @Type(() => Date)
  public readonly version: number;

  @ApiPropertyOptional({ description: 'Genus Id' })
  @IsString()
  public readonly genusId: string;

  @ApiPropertyOptional({ description: 'Genus' })
  @ValidateNested()
  @IsOptional()
  public readonly genus?: FlowerGenusShortDto;

  static fromFlowerEntity(flowerEntity: FlowerEntity): FlowerDetailDto {
    return {
      id: flowerEntity.id,
      name: flowerEntity.name,
      description: flowerEntity.description,
      createdDate: flowerEntity.createdDate,
      updatedDate: flowerEntity.updatedDate,
      genusId: flowerEntity.genusId,
      genus: flowerEntity.genus
        ? FlowerGenusShortDto.fromFlowerGenusEntity(flowerEntity.genus)
        : undefined,
      version: flowerEntity.version,
    };
  }
}
