import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Message, MessageType, ChatType } from '../entities/message.entity';
import { User } from '../entities/user.entity';
import { Session } from '../entities/session.entity';
import { SessionMember } from '../entities/session-member.entity';
import { CreateMessageDto, UpdateMessageDto, MessageResponseDto, GetMessagesQueryDto } from '../dto/message.dto';
import { MemberRole } from '../entities/session-member.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(SessionMember)
    private readonly sessionMemberRepository: Repository<SessionMember>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(sessionId: string, createMessageDto: CreateMessageDto, userId: string): Promise<MessageResponseDto> {
    // Verificar se a sessão existe
    const session = await this.sessionRepository.findOne({ where: { id: sessionId } });
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Verificar se o usuário tem acesso à sessão
    const membership = await this.sessionMemberRepository.findOne({
      where: { session: { id: sessionId }, user: { id: userId } },
    });
    if (!membership) {
      throw new ForbiddenException('User does not have access to this session');
    }

    // Validar chat_type baseado no papel do usuário
    const chatType = createMessageDto.chat_type || ChatType.GENERAL;
    if (chatType === ChatType.MASTER && membership.role !== MemberRole.MASTER) {
      throw new ForbiddenException('Only masters can send messages to master chat');
    }

    // Validar reply_to se fornecido
    if (createMessageDto.reply_to) {
      const replyMessage = await this.messageRepository.findOne({
        where: { id: createMessageDto.reply_to, session_id: sessionId },
      });
      if (!replyMessage) {
        throw new BadRequestException('Reply message not found in this session');
      }
    }

    // Criar a mensagem
    const message = this.messageRepository.create({
      ...createMessageDto,
      sender_id: userId,
      session_id: sessionId,
      type: createMessageDto.type || MessageType.USER,
      chat_type: chatType,
    });

    const savedMessage = await this.messageRepository.save(message);

    return this.formatMessageResponse(savedMessage);
  }

  async findAll(sessionId: string, userId: string, query: GetMessagesQueryDto = {}): Promise<MessageResponseDto[]> {
    // Verificar se o usuário tem acesso à sessão
    const membership = await this.sessionMemberRepository.findOne({
      where: { session: { id: sessionId }, user: { id: userId } },
    });
    if (!membership) {
      throw new ForbiddenException('User does not have access to this session');
    }

    // Construir query base
    let queryBuilder = this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .where('message.session_id = :sessionId', { sessionId })
      .andWhere('message.is_deleted = :isDeleted', { isDeleted: false })
      .orderBy('message.timestamp', 'DESC');

    // Filtrar por chat_type baseado no papel do usuário
    if (query.chat_type) {
      if (query.chat_type === ChatType.MASTER && membership.role !== MemberRole.MASTER) {
        throw new ForbiddenException('Only masters can access master chat');
      }
      queryBuilder = queryBuilder.andWhere('message.chat_type = :chatType', { chatType: query.chat_type });
    } else {
      // Se não especificado, mostrar apenas general para jogadores
      if (membership.role !== MemberRole.MASTER) {
        queryBuilder = queryBuilder.andWhere('message.chat_type = :chatType', { chatType: ChatType.GENERAL });
      }
    }

    // Aplicar paginação
    const page = parseInt(query.page || '1') || 1;
    const limit = parseInt(query.limit || '50') || 50;
    const offset = (page - 1) * limit;

    queryBuilder = queryBuilder.skip(offset).take(limit);

    const messages = await queryBuilder.getMany();

    return messages.map(message => this.formatMessageResponse(message));
  }

  async findOne(id: string, userId: string): Promise<MessageResponseDto> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['sender'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Verificar se o usuário tem acesso à sessão
    const membership = await this.sessionMemberRepository.findOne({
      where: { session: { id: message.session_id }, user: { id: userId } },
    });
    if (!membership) {
      throw new ForbiddenException('User does not have access to this message');
    }

    // Verificar permissão para mensagens do master chat
    if (message.chat_type === ChatType.MASTER && membership.role !== MemberRole.MASTER) {
      throw new ForbiddenException('Only masters can access master chat messages');
    }

    return this.formatMessageResponse(message);
  }

  async update(id: string, updateMessageDto: UpdateMessageDto, userId: string): Promise<MessageResponseDto> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['sender'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Verificar se o usuário é o autor da mensagem
    if (message.sender_id !== userId) {
      throw new ForbiddenException('Only message author can update the message');
    }

    // Verificar se a mensagem não foi deletada
    if (message.is_deleted) {
      throw new BadRequestException('Cannot update deleted message');
    }

    // Atualizar a mensagem
    Object.assign(message, updateMessageDto);
    const updatedMessage = await this.messageRepository.save(message);

    return this.formatMessageResponse(updatedMessage);
  }

  async delete(id: string, userId: string): Promise<void> {
    const message = await this.messageRepository.findOne({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Verificar se o usuário é o autor da mensagem ou master da sessão
    const membership = await this.sessionMemberRepository.findOne({
      where: { session: { id: message.session_id }, user: { id: userId } },
    });

    if (!membership) {
      throw new ForbiddenException('User does not have access to this message');
    }

    const isAuthor = message.sender_id === userId;
    const isMaster = membership.role === MemberRole.MASTER;

    if (!isAuthor && !isMaster) {
      throw new ForbiddenException('Only message author or session master can delete the message');
    }

    // Soft delete
    message.is_deleted = true;
    message.deleted_at = new Date();
    await this.messageRepository.save(message);
  }

  async getMessageCount(sessionId: string, userId: string): Promise<{ count: number }> {
    // Verificar se o usuário tem acesso à sessão
    const membership = await this.sessionMemberRepository.findOne({
      where: { session: { id: sessionId }, user: { id: userId } },
    });
    if (!membership) {
      throw new ForbiddenException('User does not have access to this session');
    }

    let queryBuilder = this.messageRepository
      .createQueryBuilder('message')
      .where('message.session_id = :sessionId', { sessionId })
      .andWhere('message.is_deleted = :isDeleted', { isDeleted: false });

    // Filtrar por chat_type baseado no papel do usuário
    if (membership.role !== MemberRole.MASTER) {
      queryBuilder = queryBuilder.andWhere('message.chat_type = :chatType', { chatType: ChatType.GENERAL });
    }

    const count = await queryBuilder.getCount();
    return { count };
  }

  private formatMessageResponse(message: Message): MessageResponseDto {
    return {
      id: message.id,
      sender_id: message.sender_id,
      session_id: message.session_id,
      content: message.content,
      timestamp: message.timestamp,
      type: message.type,
      chat_type: message.chat_type,
      reply_to: message.reply_to,
      metadata: message.metadata,
      sender: message.sender ? {
        id: message.sender.id,
        name: message.sender.name,
        avatar: message.sender.avatar,
      } : undefined,
    };
  }
} 