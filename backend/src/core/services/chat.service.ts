import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat, ChatType } from '../entities/chat.entity';
import { Message, MessageType } from '../entities/message.entity';
import { Session } from '../entities/session.entity';
import { 
  CreateChatDto, 
  UpdateChatDto, 
  ChatResponseDto,
  CreateMessageDto,
  UpdateMessageDto,
  MessageResponseDto,
  ChatWithMessagesDto,
  SendMessageToSessionDto,
  SimpleMessageDto,
  ChatWithSimpleMessagesDto
} from '../../api/dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
  ) {}

  // Métodos para Chat
  async createChat(chatData: CreateChatDto): Promise<Chat> {
    const chat = this.chatsRepository.create(chatData);
    return this.chatsRepository.save(chat);
  }

  async findChatById(id: string): Promise<Chat | null> {
    return this.chatsRepository.findOne({ 
      where: { id },
      relations: ['session']
    });
  }

  async findChatsBySession(sessionId: string): Promise<ChatResponseDto[]> {
    const chats = await this.chatsRepository.find({
      where: { sessionId },
      relations: ['messages']
    });

    return chats.map(chat => ({
      id: chat.id,
      sessionId: chat.sessionId,
      type: chat.type,
      name: chat.name,
      description: chat.description,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      messageCount: chat.messages?.length || 0
    }));
  }

  async updateChat(id: string, updateData: UpdateChatDto): Promise<Chat | null> {
    await this.chatsRepository.update(id, updateData);
    return this.findChatById(id);
  }

  async deleteChat(id: string): Promise<void> {
    await this.chatsRepository.delete(id);
  }

  // Métodos para Message
  async createMessage(messageData: CreateMessageDto): Promise<Message> {
    const message = this.messagesRepository.create(messageData);
    return this.messagesRepository.save(message);
  }

  async findMessageById(id: string): Promise<Message | null> {
    return this.messagesRepository.findOne({
      where: { id },
      relations: ['sender', 'chat']
    });
  }

  async findMessagesByChat(chatId: string, limit?: number, offset?: number): Promise<MessageResponseDto[]> {
    const query = this.messagesRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .where('message.chatId = :chatId', { chatId })
      .orderBy('message.createdAt', 'ASC');

    if (limit) {
      query.limit(limit);
    }
    if (offset) {
      query.offset(offset);
    }

    const messages = await query.getMany();

    return messages.map(message => ({
      id: message.id,
      chatId: message.chatId,
      senderId: message.senderId,
      type: message.type,
      content: message.content,
      metadata: message.metadata,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      sender: message.sender ? {
        id: message.sender.id,
        name: message.sender.name,
        avatar: message.sender.avatar
      } : undefined
    }));
  }

  // Nova função para buscar mensagens simplificadas
  async findSimpleMessagesByChat(chatId: string, limit?: number, offset?: number): Promise<SimpleMessageDto[]> {
    const query = this.messagesRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .where('message.chatId = :chatId', { chatId })
      .orderBy('message.createdAt', 'DESC'); // Mais recente primeiro

    if (limit) {
      query.limit(limit);
    }
    if (offset) {
      query.offset(offset);
    }

    const messages = await query.getMany();

    return messages.map(message => ({
      sender: {
        name: message.type === MessageType.AI
          ? 'IA'
          : (message.sender?.name || 'Usuário'),
        id: message.senderId
      },
      content: {
        text: message.content
      }
    }));
  }

  // Função auxiliar para determinar o nome do sender
  private getSenderName(message: Message): string {
    if (message.type === MessageType.AI) {
      return 'IA';
    }
    
    if (message.sender) {
      return message.sender.name;
    }
    
    return 'Usuário';
  }

  // Nova função para buscar chat com mensagens simplificadas
  async getChatWithSimpleMessages(chatId: string, limit?: number, offset?: number): Promise<ChatWithSimpleMessagesDto | undefined> {
    const chat = await this.chatsRepository.findOne({
      where: { id: chatId },
      relations: ['session']
    });

    if (!chat) return undefined;

    const messages = await this.findSimpleMessagesByChat(chatId, limit, offset);

    return {
      id: chat.id,
      sessionId: chat.sessionId,
      type: chat.type,
      name: chat.name,
      description: chat.description,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      messageCount: messages.length,
      messages
    };
  }

  async updateMessage(id: string, updateData: UpdateMessageDto): Promise<Message | null> {
    await this.messagesRepository.update(id, updateData);
    return this.findMessageById(id);
  }

  async deleteMessage(id: string): Promise<void> {
    await this.messagesRepository.delete(id);
  }

  // Métodos específicos para sessões
  async createGeneralChatForSession(sessionId: string): Promise<Chat> {
    const chat = this.chatsRepository.create({
      sessionId,
      type: ChatType.GENERAL,
      name: 'Chat Geral',
      description: 'Chat geral da sessão para todos os jogadores'
    });

    const savedChat = await this.chatsRepository.save(chat);

    // Atualizar a sessão com o chat geral
    await this.sessionsRepository.update(sessionId, { chatId: savedChat.id });

    return savedChat;
  }

  async createMasterAnnotationsChatForSession(sessionId: string): Promise<Chat> {
    const chat = this.chatsRepository.create({
      sessionId,
      type: ChatType.MASTER_ANNOTATIONS,
      name: 'Anotações do Mestre',
      description: 'Chat privado do mestre para anotações e conversas com IA'
    });

    const savedChat = await this.chatsRepository.save(chat);

    // Atualizar a sessão com o chat de anotações
    await this.sessionsRepository.update(sessionId, { masterAnnotationsChatId: savedChat.id });

    return savedChat;
  }

  async sendMessageToSession(sessionId: string, messageData: SendMessageToSessionDto): Promise<Message> {
    // Buscar a sessão para verificar qual chat usar
    const session = await this.sessionsRepository.findOne({
      where: { id: sessionId },
      relations: ['generalChat', 'masterAnnotationsChat']
    });

    if (!session) {
      throw new Error('Sessão não encontrada');
    }

    // Determinar qual chat usar baseado no tipo de mensagem
    let chatId: string;
    
    if (messageData.type === MessageType.SYSTEM || messageData.type === MessageType.AI) {
      // Para mensagens do sistema ou IA, usar o chat de anotações do mestre
      if (!session.masterAnnotationsChatId) {
        // Criar o chat de anotações se não existir
        const annotationsChat = await this.createMasterAnnotationsChatForSession(sessionId);
        chatId = annotationsChat.id;
      } else {
        chatId = session.masterAnnotationsChatId;
      }
    } else {
      // Para mensagens normais, usar o chat geral
      if (!session.chatId) {
        // Criar o chat geral se não existir
        const generalChat = await this.createGeneralChatForSession(sessionId);
        chatId = generalChat.id;
      } else {
        chatId = session.chatId;
      }
    }

    const message = this.messagesRepository.create({
      chatId,
      senderId: messageData.senderId,
      type: messageData.type || MessageType.TEXT,
      content: messageData.content,
      metadata: messageData.metadata
    });

    return this.messagesRepository.save(message);
  }

  async getChatWithMessages(chatId: string, limit?: number, offset?: number): Promise<ChatWithMessagesDto | undefined> {
    const chat = await this.chatsRepository.findOne({
      where: { id: chatId },
      relations: ['session']
    });

    if (!chat) return undefined;

    const messages = await this.findMessagesByChat(chatId, limit, offset);

    return {
      id: chat.id,
      sessionId: chat.sessionId,
      type: chat.type,
      name: chat.name,
      description: chat.description,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      messageCount: messages.length,
      messages
    };
  }
} 