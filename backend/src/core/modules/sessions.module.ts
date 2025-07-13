import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from '../entities/session.entity';
import { SessionPlayer } from '../entities/session-player.entity';
import { Chat } from '../entities/chat.entity';
import { SessionController } from 'src/api/controllers/session.controller';
import { SessionService } from '../services/session.service';

@Module({
  imports: [TypeOrmModule.forFeature([Session, SessionPlayer, Chat])],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [TypeOrmModule, SessionService],
})
export class SessionsModule {} 