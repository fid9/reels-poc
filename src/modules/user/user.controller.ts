import { Body, Controller, Post, Request } from '@nestjs/common';
import { Request as ApiRequest } from 'express';

import { ApiResponse } from '~common/endpoint/api.interface';
import { UserDetailsDto } from '~modules/user/dto/user.details.dto';

import { UserCreateDto } from './dto/user.create.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() body: UserCreateDto,
    @Request() req: ApiRequest,
  ): Promise<ApiResponse<UserDetailsDto>> {
    // TODO: get body
    return {
      body: (await this.userService.create(req.body)).toUserDetailsDto(),
    };
  }
}
