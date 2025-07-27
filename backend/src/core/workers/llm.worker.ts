import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { LLMQueueJob, LLMQueueResult } from '../interfaces/queue.interface';
import { LLMService } from '../providers/llm.service';
import { QueueResultService } from '../providers/queue-result.service';

@Processor('llm-processing')
export class LLMWorker extends WorkerHost {
  private readonly logger = new Logger(LLMWorker.name);

  constructor(
    private readonly llmService: LLMService,
    private readonly queueResultService: QueueResultService,
  ) {
    super();
  }

  async process(job: Job<LLMQueueJob>): Promise<LLMQueueResult> {
    const startTime = Date.now();
    const { sessionId, userId, request } = job.data;

    this.logger.log(`Processing LLM job: ${job.id} for session: ${sessionId}`);

    try {
      // Processar a requisição usando o LLMService
      const response = await this.llmService.generateResponse('gemini', request);
      
      const processingTime = Date.now() - startTime;
      
      this.logger.log(`LLM job completed successfully: ${job.id} in ${processingTime}ms`);

      // Atualizar a mensagem no banco de dados com o resultado
      await this.queueResultService.updateMessageWithLLMResult(
        sessionId,
        job.id || 'unknown',
        {
          success: true,
          response,
          processingTime,
          retryCount: job.attemptsMade,
        }
      );

      return {
        success: true,
        response,
        processingTime,
        retryCount: job.attemptsMade,
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      this.logger.error(`LLM job failed: ${job.id} - ${error.message}`);
      
      // Atualizar a mensagem com erro
      await this.queueResultService.markMessageAsFailed(
        sessionId,
        job.id || 'unknown',
        error.message,
      );
      
      // Se ainda há tentativas disponíveis, deixar o job falhar para retry
      if (job.attemptsMade < (job.opts.attempts || 3)) {
        throw error;
      }
      
      return {
        success: false,
        error: error.message,
        processingTime,
        retryCount: job.attemptsMade,
      };
    }
  }

  async onCompleted(job: Job<LLMQueueJob>, result: LLMQueueResult): Promise<void> {
    this.logger.log(`Job ${job.id} completed successfully with result:`, {
      sessionId: job.data.sessionId,
      processingTime: result.processingTime,
      retryCount: result.retryCount,
    });
  }

  async onFailed(job: Job<LLMQueueJob>, err: Error): Promise<void> {
    this.logger.error(`Job ${job.id} failed:`, {
      sessionId: job.data.sessionId,
      error: err.message,
      attemptsMade: job.attemptsMade,
      maxAttempts: job.opts.attempts,
    });
  }

  async onStalled(job: Job<LLMQueueJob>): Promise<void> {
    this.logger.warn(`Job ${job.id} stalled for session: ${job.data.sessionId}`);
  }
} 