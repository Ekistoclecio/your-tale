import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message, MessageType, ChatType } from '../entities/message.entity';
import { LLMQueueResult } from '../interfaces/queue.interface';



@Injectable()
export class QueueResultService {
  private readonly logger = new Logger(QueueResultService.name);
  private webSocketEmitter: ((sessionId: string, message: any) => void) | null = null;

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  setWebSocketEmitter(emitter: (sessionId: string, message: any) => void): void {
    this.webSocketEmitter = emitter;
    this.logger.log('WebSocket emitter set in QueueResultService');
  }

  async updateMessageWithLLMResult(
    sessionId: string,
    jobId: string,
    result: LLMQueueResult,
  ): Promise<void> {
    try {
      // Buscar a mensagem que contém o job ID
      let processingMessage = await this.messageRepository.findOne({
        where: {
          session_id: sessionId,
          content: `Processando resposta do AI... (Job ID: ${jobId})`,
        },
      });

      // Se não encontrar, tentar buscar a mensagem mais recente de IA na sessão
      if (!processingMessage) {
        this.logger.warn(`Processing message not found for job ID: ${jobId}, trying to find latest AI message`);
        processingMessage = await this.messageRepository.findOne({
          where: {
            session_id: sessionId,
            type: MessageType.AI,
          },
          order: {
            timestamp: 'DESC',
          },
        });
      }

      if (!processingMessage) {
        this.logger.error(`No AI message found for session ${sessionId}, job ${jobId}`);
        return;
      }

      if (result.success && result.response) {
        // Atualizar com a resposta bem-sucedida
        processingMessage.content = result.response.content;
        this.logger.log(`Message updated successfully for job: ${jobId}`);
      } else {
        // Atualizar com erro
        processingMessage.content = `Erro ao processar resposta: ${result.error || 'Erro desconhecido'}`;
        this.logger.error(`Message updated with error for job: ${jobId} - ${result.error}`);
      }

      await this.messageRepository.save(processingMessage);
      
      this.logger.log(`Message updated in database for session ${sessionId}, job ${jobId}: ${processingMessage.content.substring(0, 100)}...`);
      
      // Emitir a mensagem atualizada via WebSocket
      await this.emitWebSocketMessage(sessionId, processingMessage, jobId);
      
      this.logger.log(`WebSocket emission completed for session ${sessionId}, job ${jobId}`);
    } catch (error) {
      this.logger.error(`Failed to update message with LLM result: ${error.message}`);
      throw error;
    }
  }

  async createProcessingMessage(
    sessionId: string,
    jobId: string,
    chatType: ChatType = ChatType.GENERAL,
  ): Promise<Message> {
    const processingMessage = this.messageRepository.create({
      session_id: sessionId,
      content: `Processando resposta do AI... (Job ID: ${jobId})`,
      type: MessageType.AI,
      chat_type: chatType,
    });

    return await this.messageRepository.save(processingMessage);
  }

  private formatMessageForWebSocket(message: Message) {
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
    };
  }

  private async emitWebSocketMessage(sessionId: string, message: Message, jobId: string, isError = false) {
    if (this.webSocketEmitter) {
      const formattedMessage = this.formatMessageForWebSocket(message);
      this.webSocketEmitter(sessionId, formattedMessage);
      const logType = isError ? 'error message' : 'message';
      this.logger.log(`WebSocket ${logType} emitted for session ${sessionId}, job ${jobId}`);
    } else {
      this.logger.warn('WebSocket emitter not available');
    }
  }

  async markMessageAsFailed(
    sessionId: string,
    jobId: string,
    error: string,
  ): Promise<void> {
    try {
      const processingMessage = await this.messageRepository.findOne({
        where: {
          session_id: sessionId,
          content: `Processando resposta do AI... (Job ID: ${jobId})`,
        },
      });

      if (processingMessage) {
        processingMessage.content = `Erro ao processar resposta: ${error}`;
        await this.messageRepository.save(processingMessage);
        
        // Emitir a mensagem de erro via WebSocket
        this.emitWebSocketMessage(sessionId, processingMessage, jobId, true);
      }
    } catch (error) {
      this.logger.error(`Failed to mark message as failed: ${error.message}`);
    }
  }
} 