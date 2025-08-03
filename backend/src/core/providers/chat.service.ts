import { Injectable, Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { MessageService } from './message.service';
import { SessionMemberService } from './session-member.service';
import { CreateMessageDto, MessageResponseDto } from '../dto/message.dto';
import { MemberRole } from '../entities/session-member.entity';
import { Message, MessageType } from '../entities/message.entity';
import { QueueResultService } from './queue-result.service';
import { Inject, forwardRef } from '@nestjs/common';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  
  // Mapeamento de usuários online: userId -> socketId
  private onlineUsers = new Map<string, string>();
  
  // Mapeamento de salas de sessão: sessionId -> Set<userId>
  private sessionRooms = new Map<string, Set<string>>();
  
  // Mapeamento de sockets por usuário: userId -> Socket
  private userSockets = new Map<string, Socket>();
  
  // Referência para o servidor WebSocket
  private webSocketServer: Server | null = null;

  constructor(
    private readonly messageService: MessageService,
    private readonly sessionMemberService: SessionMemberService,
    @Inject(forwardRef(() => QueueResultService))
    private readonly queueResultService: QueueResultService,
  ) {}

  async addOnlineUser(userId: string, socketId: string): Promise<void> {
    this.onlineUsers.set(userId, socketId);
    this.logger.log(`User ${userId} is now online with socket ${socketId}`);
  }

  async removeOnlineUser(userId: string): Promise<void> {
    this.onlineUsers.delete(userId);
    this.userSockets.delete(userId);
    this.logger.log(`User ${userId} is now offline`);
  }

  async canUserJoinSession(userId: string, sessionId: string): Promise<boolean> {
    try {
      const membership = await this.sessionMemberService.findBySessionAndUser(sessionId, userId);
      return !!membership;
    } catch (error) {
      this.logger.error(`Error checking user access to session: ${error.message}`);
      return false;
    }
  }

  async joinSession(userId: string, sessionId: string, socket: Socket): Promise<void> {
    // Adicionar o socket à sala da sessão
    await socket.join(`session:${sessionId}`);
    
    // Adicionar o usuário ao mapeamento de salas
    if (!this.sessionRooms.has(sessionId)) {
      this.sessionRooms.set(sessionId, new Set());
    }
    this.sessionRooms.get(sessionId)!.add(userId);
    
    // Armazenar o socket do usuário
    this.userSockets.set(userId, socket);
    
    this.logger.log(`User ${userId} joined session ${sessionId}`);
  }

  async leaveSession(userId: string, sessionId: string, socket: Socket): Promise<void> {
    // Remover o socket da sala da sessão
    await socket.leave(`session:${sessionId}`);
    
    // Remover o usuário do mapeamento de salas
    const sessionRoom = this.sessionRooms.get(sessionId);
    if (sessionRoom) {
      sessionRoom.delete(userId);
      if (sessionRoom.size === 0) {
        this.sessionRooms.delete(sessionId);
      }
    }
    
    this.logger.log(`User ${userId} left session ${sessionId}`);
  }

  async leaveAllSessions(userId: string): Promise<void> {
    // Remover o usuário de todas as salas
    for (const [sessionId, users] of this.sessionRooms.entries()) {
      if (users.has(userId)) {
        users.delete(userId);
        if (users.size === 0) {
          this.sessionRooms.delete(sessionId);
        }
      }
    }
    
    this.logger.log(`User ${userId} left all sessions`);
  }

  async sendMessage(sessionId: string, messageData: CreateMessageDto, userId: string): Promise<MessageResponseDto> {
    try {
      // Usar o serviço de mensagens existente para criar a mensagem
      // Isso garante que todas as validações e lógicas de IA sejam aplicadas
      const message = await this.messageService.create(sessionId, messageData, userId);
      const messageWithSender = await this.messageService.findOne(message.id, userId);
      
      this.logger.log(`Message sent in session ${sessionId} by user ${userId}`);
      
      return messageWithSender;
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`);
      throw error;
    }
  }

  async getOnlineUsersInSession(sessionId: string): Promise<string[]> {
    const sessionRoom = this.sessionRooms.get(sessionId);
    if (!sessionRoom) {
      return [];
    }
    
    return Array.from(sessionRoom);
  }

  async getOnlineUsersInfoInSession(sessionId: string): Promise<Array<{ userId: string; socketId: string }>> {
    const sessionRoom = this.sessionRooms.get(sessionId);
    if (!sessionRoom) {
      return [];
    }
    
    const onlineUsersInfo: Array<{ userId: string; socketId: string }> = [];
    
    for (const userId of sessionRoom) {
      const socketId = this.onlineUsers.get(userId);
      if (socketId) {
        onlineUsersInfo.push({ userId, socketId });
      }
    }
    
    return onlineUsersInfo;
  }

  async isUserOnline(userId: string): Promise<boolean> {
    return this.onlineUsers.has(userId);
  }

  async getSessionMembers(sessionId: string): Promise<string[]> {
    try {
      const members = await this.sessionMemberService.findAllBySession(sessionId);
      return members.map(member => member.userId);
    } catch (error) {
      this.logger.error(`Error getting session members: ${error.message}`);
      return [];
    }
  }

  setWebSocketServer(server: Server): void {
    this.webSocketServer = server;
    this.logger.log('WebSocket server reference set in ChatService');
    
    // Configurar o emitter para o QueueResultService
    this.queueResultService.setWebSocketEmitter((sessionId: string, message: any) => {
      if (this.webSocketServer) {
        this.webSocketServer.to(`session:${sessionId}`).emit('new_message', message);
        this.logger.log(`WebSocket message emitted for session ${sessionId}`);
      }
    });
  }

  async broadcastToSession(sessionId: string, event: string, data: any): Promise<void> {
    if (this.webSocketServer) {
      this.webSocketServer.to(`session:${sessionId}`).emit(event, data);
      this.logger.log(`Broadcasting ${event} to session ${sessionId}`);
    } else {
      this.logger.warn('WebSocket server not available for broadcasting');
    }
  }

  async emitLLMMessage(sessionId: string, message: Message, jobId: string, isError = false): Promise<void> {
    this.logger.log(`Attempting to emit LLM message for session ${sessionId}, job ${jobId}`);
    
    if (this.webSocketServer) {
      const formattedMessage = {
        id: message.id,
        sender_id: message.sender_id,
        session_id: message.session_id,
        content: message.content,
        timestamp: message.timestamp,
        type: message.type,
        chat_type: message.chat_type,
        reply_to: message.reply_to,
        metadata: message.metadata,
      };
      
      this.logger.log(`Emitting WebSocket message: ${JSON.stringify(formattedMessage, null, 2)}`);
      
      this.webSocketServer.to(`session:${sessionId}`).emit('new_message', formattedMessage);
      const logType = isError ? 'error message' : 'message';
      this.logger.log(`WebSocket ${logType} emitted for session ${sessionId}, job ${jobId}`);
    } else {
      this.logger.error('WebSocket server not available for LLM message emission');
    }
  }

  async notifyAIMessageProcessed(sessionId: string, message: MessageResponseDto): Promise<void> {
    // Esta função será chamada quando uma mensagem de IA for processada
    // para notificar todos os usuários na sessão
    this.logger.log(`AI message processed for session ${sessionId}: ${message.id}`);
  }

  // Métodos para integração com o sistema de filas
  async handleLLMJobCompleted(sessionId: string, jobId: string, result: any): Promise<void> {
    try {
      // Notificar todos os usuários na sessão sobre a conclusão do job
      this.logger.log(`LLM job completed for session ${sessionId}, jobId: ${jobId}`);
      
      // A atualização da mensagem será feita pelo QueueResultService
      // Aqui apenas logamos a conclusão para fins de monitoramento
    } catch (error) {
      this.logger.error(`Error handling LLM job completion: ${error.message}`);
    }
  }

  async emitLLMJobResult(sessionId: string, jobId: string, result: any): Promise<void> {
    try {
      this.logger.log(`Emitting LLM job result for session ${sessionId}, jobId: ${jobId}`);
      
      if (this.webSocketServer) {
        // Buscar a mensagem atualizada no banco de dados
        const messageRepository = this.messageService['messageRepository'];
        const processingMessage = await messageRepository.findOne({
          where: {
            session_id: sessionId,
            content: `Processando resposta do AI... (Job ID: ${jobId})`,
          },
        });

        if (processingMessage) {
          // Se não encontrar a mensagem de processamento, buscar a mais recente de IA
          const aiMessage = processingMessage || await messageRepository.findOne({
            where: {
              session_id: sessionId,
              type: MessageType.AI,
            },
            order: {
              timestamp: 'DESC',
            },
          });

          if (aiMessage) {
            const formattedMessage = {
              id: aiMessage.id,
              sender_id: aiMessage.sender_id,
              session_id: aiMessage.session_id,
              content: aiMessage.content,
              timestamp: aiMessage.timestamp,
              type: aiMessage.type,
              chat_type: aiMessage.chat_type,
              reply_to: aiMessage.reply_to,
              metadata: aiMessage.metadata,
            };
            
            this.webSocketServer.to(`session:${sessionId}`).emit('new_message', formattedMessage);
            this.logger.log(`WebSocket message emitted for session ${sessionId}, job ${jobId}`);
          } else {
            this.logger.warn(`No AI message found for session ${sessionId}, job ${jobId}`);
          }
        } else {
          this.logger.warn(`No processing message found for session ${sessionId}, job ${jobId}`);
        }
      } else {
        this.logger.error('WebSocket server not available for LLM job result emission');
      }
    } catch (error) {
      this.logger.error(`Error emitting LLM job result: ${error.message}`);
    }
  }
} 