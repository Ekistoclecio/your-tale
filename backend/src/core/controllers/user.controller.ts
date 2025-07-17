import { Controller, Get, Patch, Body, UseGuards, NotFoundException } from '@nestjs/common';
import { UserService } from '../providers/user.service';
import { UpdateUserDto } from '../dto/auth.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getProfile(@CurrentUser() user: any) {
    const userData = await this.userService.findById(user.userId);
    if (!userData) {
      throw new NotFoundException('User not found');
    }
    const { password, ...result } = userData;
    return result;
  }

  @Patch('me')
  async updateProfile(@CurrentUser() user: any, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.update(user.userId, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    const { password, ...result } = updatedUser;
    return result;
  }
} 