import { Module } from '@nestjs/common';            
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from './config/db/database.config';
import { UserModule } from './core/modules/user.module';
import { SessionModule } from './core/modules/session.module';
import { CharacterModule } from './core/modules/character.module';
import { NoteModule } from './core/modules/note.module';
import { LLMModule } from './core/modules/llm.module';
import { QueueModule } from './core/modules/queue.module';
import { ChatModule } from './core/modules/chat.module';
import { JwtGlobalModule } from './core/modules/jwt.module';
import { AppController } from './core/controllers/app.controller';
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
    JwtGlobalModule,
    UserModule,
    SessionModule,
    CharacterModule,
    NoteModule,
    LLMModule,
    QueueModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
