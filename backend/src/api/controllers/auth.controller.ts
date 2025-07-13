import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from '../../core/services/auth.service';
import { LocalAuthGuard } from '../../core/guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() userData: { email: string; password: string; passwordConfirmation: string; name: string }) {
    return this.authService.register(userData);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
} 