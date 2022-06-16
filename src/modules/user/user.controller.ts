import { Body, Controller, Post } from '@nestjs/common';

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
  ): Promise<ApiResponse<UserDetailsDto>> {
    return { body: (await this.userService.create(body)).toUserDetailsDto() };
  }
}
