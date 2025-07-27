import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message, MessageType, ChatType } from '../entities/message.entity';
import { LLMQueueResult } from '../interfaces/queue.interface';

@Injectable()
export class QueueResultService {
  private readonly logger = new Logger(QueueResultService.name);

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async updateMessageWithLLMResult(
    sessionId: string,
    jobId: string,
    result: LLMQueueResult,
  ): Promise<void> {
    try {
      // Buscar a mensagem que contém o job ID
      const processingMessage = await this.messageRepository.findOne({
        where: {
          session_id: sessionId,
          content: `Processando resposta do AI... (Job ID: ${jobId})`,
        },
      });

      if (!processingMessage) {
        this.logger.warn(`Processing message not found for job ID: ${jobId}`);
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
      }
    } catch (error) {
      this.logger.error(`Failed to mark message as failed: ${error.message}`);
    }
  }
} 