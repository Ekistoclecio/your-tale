import { Module } from '@nestjs/common';            
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from './config/db/database.config';
import { UserModule } from './core/modules/user.module';
import { SessionModule } from './core/modules/session.module';
import { CharacterModule } from './core/modules/character.module';
import { NoteModule } from './core/modules/note.module';
import { AppController } from './api/controllers/app.controller';
import { AppService } from './app.service';

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
    UserModule,
    SessionModule,
    CharacterModule,
    NoteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
