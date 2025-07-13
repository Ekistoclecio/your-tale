import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ChatService } from '../../core/services/chat.service';
import { 
  CreateChatDto, 
  UpdateChatDto, 
  ChatResponseDto,
  CreateMessageDto,
  UpdateMessageDto,
  MessageResponseDto,
  ChatWithMessagesDto,
  ChatWithSimpleMessagesDto,
  SimpleMessageDto,
  SendMessageToSessionDto
} from '../dto/chat.dto';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Endpoints para Chat
  @Post()
  async createChat(@Body() chatData: CreateChatDto): Promise<ChatResponseDto> {
    const chat = await this.chatService.createChat(chatData);
    return {
      id: chat.id,
      sessionId: chat.sessionId,
      type: chat.type,
      name: chat.name,
      description: chat.description,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt
    };
  }

  @Get(':id')
  async findChatById(@Param('id') id: string): Promise<ChatResponseDto | undefined> {
    const chat = await this.chatService.findChatById(id);
    if (!chat) return undefined;

    return {
      id: chat.id,
      sessionId: chat.sessionId,
      type: chat.type,
      name: chat.name,
      description: chat.description,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt
    };
  }

  @Get('session/:sessionId')
  async findChatsBySession(@Param('sessionId') sessionId: string): Promise<ChatResponseDto[]> {
    return this.chatService.findChatsBySession(sessionId);
  }

  @Put(':id')
  async updateChat(@Param('id') id: string, @Body() updateData: UpdateChatDto): Promise<ChatResponseDto | undefined> {
    const chat = await this.chatService.updateChat(id, updateData);
    if (!chat) return undefined;

    return {
      id: chat.id,
      sessionId: chat.sessionId,
      type: chat.type,
      name: chat.name,
      description: chat.description,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt
    };
  }

  @Delete(':id')
  async deleteChat(@Param('id') id: string): Promise<void> {
    return this.chatService.deleteChat(id);
  }

  // Endpoints para Message
  @Post('messages')
  async createMessage(@Body() messageData: CreateMessageDto): Promise<MessageResponseDto> {
    const message = await this.chatService.createMessage(messageData);
    const sender = message.sender ? {
      id: message.sender.id,
      name: message.sender.name,
      avatar: message.sender.avatar
    } : undefined;

    return {
      id: message.id,
      chatId: message.chatId,
      senderId: message.senderId,
      type: message.type,
      content: message.content,
      metadata: message.metadata,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      sender
    };
  }

  @Get('messages/:chatId')
  async findMessagesByChat(
    @Param('chatId') chatId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ): Promise<MessageResponseDto[]> {
    return this.chatService.findMessagesByChat(chatId, limit, offset);
  }

  // Novo endpoint para mensagens simplificadas
  @Get('messages/:chatId/simple')
  async findSimpleMessagesByChat(
    @Param('chatId') chatId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ): Promise<SimpleMessageDto[]> {
    return this.chatService.findSimpleMessagesByChat(chatId, limit, offset);
  }

  @Put('messages/:id')
  async updateMessage(@Param('id') id: string, @Body() updateData: UpdateMessageDto): Promise<MessageResponseDto | undefined> {
    const message = await this.chatService.updateMessage(id, updateData);
    if (!message) return undefined;

    const sender = message.sender ? {
      id: message.sender.id,
      name: message.sender.name,
      avatar: message.sender.avatar
    } : undefined;

    return {
      id: message.id,
      chatId: message.chatId,
      senderId: message.senderId,
      type: message.type,
      content: message.content,
      metadata: message.metadata,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      sender
    };
  }

  @Delete('messages/:id')
  async deleteMessage(@Param('id') id: string): Promise<void> {
    return this.chatService.deleteMessage(id);
  }

  // Endpoints específicos para sessões
  @Post('session/:sessionId/message')
  async sendMessageToSession(
    @Param('sessionId') sessionId: string,
    @Body() messageData: SendMessageToSessionDto
  ): Promise<MessageResponseDto> {
    const message = await this.chatService.sendMessageToSession(sessionId, messageData);
    const sender = message.sender ? {
      id: message.sender.id,
      name: message.sender.name,
      avatar: message.sender.avatar
    } : undefined;

    return {
      id: message.id,
      chatId: message.chatId,
      senderId: message.senderId,
      type: message.type,
      content: message.content,
      metadata: message.metadata,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      sender
    };
  }

  @Get(':id/with-messages')
  async getChatWithMessages(
    @Param('id') id: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ): Promise<ChatWithMessagesDto | undefined> {
    return this.chatService.getChatWithMessages(id, limit, offset);
  }

  // Novo endpoint para chat com mensagens simplificadas
  @Get(':id/with-simple-messages')
  async getChatWithSimpleMessages(
    @Param('id') id: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ): Promise<ChatWithSimpleMessagesDto | undefined> {
    return this.chatService.getChatWithSimpleMessages(id, limit, offset);
  }
} 