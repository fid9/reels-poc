import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

import { FlowerEntity } from '~database/entities';

export class FlowerShortDto {
  @ApiPropertyOptional({ description: 'Flower Id' })
  @IsString()
  public readonly id: string;

  @ApiPropertyOptional({ description: 'Flower Name' })
  @IsBoolean()
  public readonly name: string;

  @ApiPropertyOptional({ description: 'Genus Id' })
  @IsBoolean()
  public readonly genusId: string;

  static fromFlowerEntity(flowerEntity: FlowerEntity): FlowerShortDto {
    return {
      id: flowerEntity.id,
      name: flowerEntity.name,
      genusId: flowerEntity.genusId,
    };
  }
}
