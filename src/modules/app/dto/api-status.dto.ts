import { ApiProperty } from '@nestjs/swagger';

import { ApiStatus } from '../interfaces/api-status.interface';

export class ApiStatusDto {
  @ApiProperty({
    description: 'Api Status Uptime',
    example: '1d 12h 10m 30s',
  })
  public readonly uptime: string;

  @ApiProperty({
    description: 'Api Status Environment',
    example: 'project-dev',
  })
  public readonly environment: string;

  @ApiProperty({
    description: 'Api Status Version',
    example: 'project-dev-1.0.0',
  })
  public readonly version: string;

  @ApiProperty({
    description: 'Api Status Release (Git Hash Format)',
    example: '9eabf5b536662000f79978c4d1b6e4eff5c8d785',
  })
  public readonly release: string;

  @ApiProperty({
    description: 'Api Status Build Time',
    example: '2022-01-01T10:00:00.000Z',
  })
  public readonly buildTime: string;

  static fromApiStatus(apiStatus: ApiStatus): ApiStatusDto {
    return {
      uptime: apiStatus.uptime,
      environment: apiStatus.environment,
      version: apiStatus.version,
      release: apiStatus.release,
      buildTime: apiStatus.buildTime,
    };
  }
}
