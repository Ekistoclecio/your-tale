import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './api/controllers/app.controller';
import { AppService } from './core/services/app.service';
import { UsersModule } from './core/modules/users.module';
import { CharactersModule } from './core/modules/characters.module';
import { SessionsModule } from './core/modules/sessions.module';
import typeorm from './config/db/database.config';
import { AuthModule } from './core/modules/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [typeorm]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (configService.get('typeorm')!)
    }),
    UsersModule,
    CharactersModule,
    SessionsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
