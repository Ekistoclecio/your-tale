import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ChatService } from './chat.service';
import { LLMQueueJob, LLMQueueResult } from '../interfaces/queue.interface';

@Processor('llm-processing')
export class WebSocketQueueService extends WorkerHost {
  private readonly logger = new Logger(WebSocketQueueService.name);

  constructor(
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
  ) {
    super();
  }

  async process(job: Job<LLMQueueJob>): Promise<LLMQueueResult> {
    // Este worker não processa jobs, apenas escuta eventos
    // O processamento real é feito pelo LLMWorker
    throw new Error('This worker does not process jobs');
  }

  async onCompleted(job: Job<LLMQueueJob>, result: LLMQueueResult): Promise<void> {
    try {
      const { sessionId } = job.data;
      
      this.logger.log(`LLM job completed for session ${sessionId}: ${job.id}`);
      
      // Buscar a mensagem atualizada e emitir via WebSocket
      await this.chatService.emitLLMJobResult(sessionId, job.id || 'unknown', result);
      
    } catch (error) {
      this.logger.error(`Error handling LLM job completion: ${error.message}`);
    }
  }

  async onFailed(job: Job<LLMQueueJob>, error: Error): Promise<void> {
    try {
      const { sessionId } = job.data;
      
      this.logger.error(`LLM job failed for session ${sessionId}: ${job.id} - ${error.message}`);
      
      // Notificar o serviço de chat sobre a falha do job
      await this.chatService.handleLLMJobCompleted(sessionId, job.id || 'unknown', {
        success: false,
        error: error.message,
      });
      
    } catch (err) {
      this.logger.error(`Error handling LLM job failure: ${err.message}`);
    }
  }
} 