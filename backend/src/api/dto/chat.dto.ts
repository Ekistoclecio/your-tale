import { ChatType } from '../../core/entities/chat.entity';
import { MessageType } from '../../core/entities/message.entity';

// DTOs para Chat
export class CreateChatDto {
  sessionId: string;
  type: ChatType;
  name?: string;
  description?: string;
}

export class UpdateChatDto {
  name?: string;
  description?: string;
}

export class ChatResponseDto {
  id: string;
  sessionId: string;
  type: ChatType;
  name?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount?: number;
}

// DTOs para Message
export class CreateMessageDto {
  chatId: string;
  senderId?: string;
  type: MessageType;
  content: string;
  metadata?: Record<string, any>;
}

export class UpdateMessageDto {
  content?: string;
  metadata?: Record<string, any>;
}

export class MessageResponseDto {
  id: string;
  chatId: string;
  senderId?: string;
  type: MessageType;
  content: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

// DTO para resposta simplificada de mensagem
export class SimpleMessageDto {
  sender: {
    name: string;
    id?: string;
  };
  content: {
    text: string;
  };
}

// DTOs para operações específicas
export class ChatWithMessagesDto extends ChatResponseDto {
  messages: MessageResponseDto[];
}

export class ChatWithSimpleMessagesDto extends ChatResponseDto {
  messages: SimpleMessageDto[];
}

export class SendMessageToSessionDto {
  sessionId: string;
  senderId?: string;
  content: string;
  type?: MessageType;
  metadata?: Record<string, any>;
} 