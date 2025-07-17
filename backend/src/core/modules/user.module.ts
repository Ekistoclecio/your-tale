import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { UserService } from '../providers/user.service';
import { AuthService } from '../providers/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { UserController } from '../controllers/user.controller';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'fallback-secret',
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [UserService, AuthService, JwtStrategy],
  controllers: [AuthController, UserController],
  exports: [UserService, AuthService],
})
export class UserModule {} 