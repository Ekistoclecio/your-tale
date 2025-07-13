import { Controller, Get, Put, Body, Param, Query } from '@nestjs/common';
import { UserService } from '../../core/services/user.service';
import { UpdateUserDto, UserResponseDto } from '../dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('by-email')
  async getByEmail(@Query('email') email: string): Promise<UserResponseDto | undefined> {
    return await this.userService.findByEmailResponse(email);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<UserResponseDto | undefined> {
    return await this.userService.findByIdResponse(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: UpdateUserDto): Promise<UserResponseDto | undefined> {
    return await this.userService.updateResponse(id, updateData);
  }
}
