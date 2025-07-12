import { Controller, Get } from '@nestjs/common';
import { UserService } from '../../core/services/user.service';
import { User } from 'src/core/entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getHello(): Promise<User | undefined> {
    return await this.userService.findByEmail('test@test.com');
  }
}
