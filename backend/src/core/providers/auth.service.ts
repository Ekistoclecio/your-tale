import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { RegisterDto, LoginDto } from '../dto/auth.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<Partial<User>> {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.userService.create(registerDto);
    const { password, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto): Promise<{ token: string; user: Partial<User> }> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await user.validatePassword(loginDto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    const { password, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userService.findById(userId);
  }
} 