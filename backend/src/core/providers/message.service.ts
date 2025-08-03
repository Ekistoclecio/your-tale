import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Message, MessageType, ChatType } from '../entities/message.entity';
import { User } from '../entities/user.entity';
import { Session, SessionStatus } from '../entities/session.entity';
import { SessionMember } from '../entities/session-member.entity';
import { CreateMessageDto, UpdateMessageDto, MessageResponseDto, GetMessagesQueryDto } from '../dto/message.dto';
import { MemberRole } from '../entities/session-member.entity';
import { LLMService } from './llm.service';
import { LLMRequest } from '../interfaces/llm.interface';
import { CharacterService } from './character.service';
import { Character } from '../entities/character.entity';
import { LLMQueueService } from './llm-queue.service';
import { LLMQueueResult } from '../interfaces/queue.interface';
import { PaginatedResponseDto } from '../dto/pagination.dto';

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
    private readonly llmService: LLMService,
    private readonly characterService: CharacterService,
    private readonly llmQueueService: LLMQueueService,
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

    const isMasterSession = session.is_ai_master;
    const isMasterChat = chatType === ChatType.MASTER && membership.role === MemberRole.MASTER;

    if (isMasterSession && isMasterChat) {
      throw new BadRequestException('Master chat is not allowed in master session');
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

    if (isMasterSession) {
      this.handleMasterAIMessage(savedMessage);
    }

    if (isMasterChat) {
      return await this.handleMasterChatMessage(savedMessage);
    }

    return this.formatMessageResponse(savedMessage);
  }

  private async handleMasterChatMessage(message: Message): Promise<MessageResponseDto> {
    const messageHistory = await this.messageRepository.find({
      where: {
        session_id: message.session_id,
        is_deleted: false,
        chat_type: ChatType.MASTER,
      },
      order: {
        timestamp: 'ASC',
      },
    });

    console.log('messageHistory', messageHistory);

    const request: LLMRequest = {
      messages: messageHistory.map(msg => ({
        role: msg.type === MessageType.USER || msg.type === MessageType.SYSTEM ? 'user' : 'assistant',
        content: msg.content,
      }))
    }

    // Adicionar job à fila em vez de processar diretamente
    const jobId = await this.llmQueueService.addLLMJob(
      message.session_id,
      message.sender_id,
      request,
      {
        concurrency: 2,
        maxRetries: 3,
        backoffDelay: 5000,
      }
    );

    // Criar uma mensagem temporária indicando que a resposta está sendo processada
    const processingMessage = this.messageRepository.create({
      session_id: message.session_id,
      content: `Processando resposta do AI... (Job ID: ${jobId})`,
      type: MessageType.AI,
      chat_type: ChatType.MASTER,
    });

    await this.messageRepository.save(processingMessage);

    // Aguardar a conclusão do job usando Promise
    const result = await this.waitForJobCompletionWithPromise(jobId);
    
    // Atualizar a mensagem com o resultado
    if (result.success && result.response) {
      processingMessage.content = result.response.content;
    } else {
      processingMessage.content = `Erro ao processar resposta: ${result.error || 'Erro desconhecido'}`;
    }
    
    await this.messageRepository.save(processingMessage);

    return this.formatMessageResponse(processingMessage);
  }

  private handleAIChatContent(message: Message, sessionCharacters: Character[]): string {
    if (message.type === MessageType.AI || message.type === MessageType.SYSTEM) {
      return message.content;
    }

    const character = sessionCharacters.find(c => c.user_id === message.sender_id);

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    return `
      O jogador \`${character.name}\` enviou uma mensagem para você:

      ${message.content}

      Os atributos do jogador são:

      ${JSON.stringify(character.status, null, 2)},
      ${JSON.stringify(character.character_sheet, null, 2)}

      Caso você ache que ele deve rolar um dado, basei-se em um desses atritubos.`
    
  }

  private async handleMasterAIMessage(message: Message): Promise<void> {
    const messageHistory = await this.messageRepository.find({
      where: {
        session_id: message.session_id,
        is_deleted: false,
        chat_type: ChatType.GENERAL,
      },
      order: {
        timestamp: 'ASC',
      },
    });

    const sessionCharacters = await this.characterService.findBySession(message.session_id, message.sender_id);

    const request: LLMRequest = {
      messages: messageHistory.map(msg => ({
        role: msg.type === MessageType.USER || msg.type === MessageType.SYSTEM ? 'user' : 'assistant',
        content: this.handleAIChatContent(msg, sessionCharacters),
      }))
    }

    // Adicionar job à fila em vez de processar diretamente
    const jobId = await this.llmQueueService.addLLMJob(
      message.session_id,
      message.sender_id,
      request,
      {
        concurrency: 2,
        maxRetries: 3,
        backoffDelay: 5000,
      }
    );

    // Criar uma mensagem temporária indicando que a resposta está sendo processada
    const processingMessage = this.messageRepository.create({
      session_id: message.session_id,
      content: `Processando resposta do AI... (Job ID: ${jobId})`,
      type: MessageType.AI,
    });

    await this.messageRepository.save(processingMessage);

    // Aguardar a conclusão do job usando Promise
    const result = await this.waitForJobCompletionWithPromise(jobId);
    
    // Atualizar a mensagem com o resultado
    if (result.success && result.response) {
      processingMessage.content = result.response.content;
    } else {
      processingMessage.content = `Erro ao processar resposta: ${result.error || 'Erro desconhecido'}`;
    }
    
    await this.messageRepository.save(processingMessage);
  }

  private async makeFirstChatMessage(session: Session): Promise<string> {

    const characters = await this.characterService.findAllBySession(session.id);

    return `Você agora é um mestre de RPG.
    O tema da história que você contará é: ${session.title} - ${session.description}
    Inicie a conversa agora com uma apresentação sobre a história.
    Uma breve descrição dos personagens atuais:

    ${characters.map(character => `${character.name}\n${character.status?.description}`).join('\n\n')}

    *Observações sobre nosso chat:*
    - Durante nossa conversa, trarei sempre informações sobre os status dos jogadores para que você se baseie neles para tomar decisões.
    - Lembre de além de trazer o contexto da história, também criar uma situação inicial para os jogadores.
    - Lembre-se, você não deve interpretar os personagens agora citados, eles são os jogadores, deve apenas dizer onde eles estão e o que acontece com eles de acordo com as ações ditas pelos jogadores.
    - Caso o jogador deseje tomar alguma atitude, decida se ele vai precisar rolar um dado ou não, e se sim, qual o tipo de dado que ele deve rolar. 
    - Lembre-se também, você é um mestre com personalidade calma e tranquila, então gosta de ajudar o máximo que puder os jogadores.
    - Lembre-se, você é UM MESTRE DE MESA DE RPG, sendo assim, a história é contada em terceira pessoa e os únicos personagens são os jogadores e os NPCs que você insere na história.
    `
  }

  async startAiChat(sessionId: string): Promise<void> {

    const session = await this.sessionRepository.findOne({ where: { id: sessionId } });
    if (!session) throw new NotFoundException('Session not found');
    const chatMessages = await this.messageRepository.find({
      where: {
        session_id: sessionId,
      }
    });

    if (chatMessages.length !== 0) {
      throw new BadRequestException('Session already has messages');
    }

    const newMessage = this.messageRepository.create({
      session_id: sessionId,
      content: await this.makeFirstChatMessage(session),
      type: MessageType.SYSTEM,
    });

    await this.messageRepository.save(newMessage);

    await this.handleMasterAIMessage(newMessage);
  }

  async findAll(sessionId: string, userId: string, query: GetMessagesQueryDto = {}): Promise<PaginatedResponseDto<MessageResponseDto>> {
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
      .andWhere('message.type != :type', { type: MessageType.SYSTEM })
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

    // Contar total de itens
    const totalItems = await queryBuilder.getCount();

    // Aplicar paginação na query
    queryBuilder = queryBuilder.skip(offset).take(limit);
    const messages = await queryBuilder.getMany();

    // Calcular informações de paginação
    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: messages.map(message => this.formatMessageResponse(message)),
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage,
      hasPreviousPage,
    };
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

  // Método mais eficiente usando Promise para aguardar conclusão do job
  private async waitForJobCompletionWithPromise(jobId: string, timeoutMs: number = 60000): Promise<LLMQueueResult> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Job timeout after ${timeoutMs}ms`));
      }, timeoutMs);

      const checkJob = async () => {
        try {
          const status = await this.llmQueueService.getJobStatus(jobId);
          
          if (status.status === 'completed') {
            clearTimeout(timeout);
            resolve(status.result);
            return;
          }
          
          if (status.status === 'failed') {
            clearTimeout(timeout);
            resolve({
              success: false,
              error: status.failedReason || 'Job failed',
              processingTime: 0,
              retryCount: 0,
            });
            return;
          }
          
          // Se ainda está processando, verificar novamente em 1 segundo
          setTimeout(checkJob, 1000);
        } catch (error) {
          clearTimeout(timeout);
          reject(error);
        }
      };

      checkJob();
    });
  }
} 