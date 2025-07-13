import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from '../entities/chat.entity';
import { Message } from '../entities/message.entity';
import { Session } from '../entities/session.entity';
import { ChatController } from '../../api/controllers/chat.controller';
import { ChatService } from '../services/chat.service';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message, Session])],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [TypeOrmModule, ChatService],
})
export class ChatsModule {} 