import { IsString, IsEnum, IsOptional, IsUUID, IsObject, IsNotEmpty } from 'class-validator';
import { MessageType, ChatType } from '../entities/message.entity';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;

  @IsOptional()
  @IsEnum(ChatType)
  chat_type?: ChatType;

  @IsOptional()
  @IsUUID()
  reply_to?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdateMessageDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class MessageResponseDto {
  id: string;
  sender_id: string;
  session_id: string;
  content: string;
  timestamp: Date;
  type: MessageType;
  chat_type: ChatType;
  reply_to?: string | null;
  metadata?: Record<string, any> | null;
  sender?: {
    id: string;
    name: string;
    avatar?: string | null;
  };
}

export class GetMessagesQueryDto {
  @IsOptional()
  @IsEnum(ChatType)
  chat_type?: ChatType;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
} 