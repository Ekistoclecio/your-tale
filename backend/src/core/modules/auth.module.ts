import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '../../api/controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { JwtStrategy } from '../../core/strategies/jwt.strategy';
import { LocalStrategy } from '../strategies/local.strategy';
import { UsersModule } from './users.module';

@Module({
  imports: [
    UsersModule, // Import UsersModule to access UserService
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
