import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, Job } from 'bullmq';
import { LLMService } from './llm.service';
import { LLMQueueJob, LLMQueueResult, QueueConfig } from '../interfaces/queue.interface';
import { LLMRequest } from '../interfaces/llm.interface';

@Injectable()
export class LLMQueueService {
  private readonly logger = new Logger(LLMQueueService.name);
  private readonly defaultConfig: QueueConfig = {
    concurrency: 3,
    maxRetries: 3,
    backoffDelay: 5000,
    rateLimit: {
      max: 10,
      duration: 60000, // 1 minuto
    },
  };

  constructor(
    @InjectQueue('llm-processing') private readonly llmQueue: Queue,
    private readonly llmService: LLMService,
  ) {}

  async addLLMJob(
    sessionId: string,
    userId: string,
    request: LLMRequest,
    config?: Partial<QueueConfig>,
  ): Promise<string> {
    const jobId = `llm-${sessionId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const jobConfig = { ...this.defaultConfig, ...config };
    
    const jobData: LLMQueueJob = {
      id: jobId,
      sessionId,
      userId,
      request,
      maxRetries: jobConfig.maxRetries,
    };

    try {
      await this.llmQueue.add(
        'process-llm-request',
        jobData,
        {
          jobId,
          priority: 1,
          attempts: jobConfig.maxRetries,
          backoff: {
            type: 'exponential',
            delay: jobConfig.backoffDelay,
          },
          removeOnComplete: 100,
          removeOnFail: 50,
        }
      );

      this.logger.log(`LLM job added to queue: ${jobId} for session: ${sessionId}`);
      return jobId;
    } catch (error) {
      this.logger.error(`Failed to add LLM job to queue: ${error.message}`);
      throw error;
    }
  }

  async getJobStatus(jobId: string): Promise<any> {
    try {
      const job = await this.llmQueue.getJob(jobId);
      
      if (!job) {
        return { status: 'not_found' };
      }

      const state = await job.getState();
      const progress = await job.progress;
      const result = job.returnvalue;
      const failedReason = job.failedReason;

      return {
        id: jobId,
        status: state,
        progress,
        result,
        failedReason,
        timestamp: job.timestamp,
        processedOn: job.processedOn,
        finishedOn: job.finishedOn,
      };
    } catch (error) {
      this.logger.error(`Failed to get job status: ${error.message}`);
      throw error;
    }
  }

  async getQueueStats(): Promise<any> {
    try {
      const waiting = await this.llmQueue.getWaiting();
      const active = await this.llmQueue.getActive();
      const completed = await this.llmQueue.getCompleted();
      const failed = await this.llmQueue.getFailed();

      return {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        total: waiting.length + active.length + completed.length + failed.length,
      };
    } catch (error) {
      this.logger.error(`Failed to get queue stats: ${error.message}`);
      throw error;
    }
  }

  async clearQueue(): Promise<void> {
    try {
      // Limpar diferentes tipos de jobs
      await this.llmQueue.clean(0, 0, 'completed');
      await this.llmQueue.clean(0, 0, 'failed');
      await this.llmQueue.clean(0, 0, 'wait');
      await this.llmQueue.clean(0, 0, 'active');
      this.logger.log('LLM queue cleared successfully');
    } catch (error) {
      this.logger.error(`Failed to clear queue: ${error.message}`);
      throw error;
    }
  }

  async processLLMJob(job: Job<LLMQueueJob>): Promise<LLMQueueResult> {
    const startTime = Date.now();
    const { sessionId, userId, request } = job.data;

    this.logger.log(`Processing LLM job: ${job.id} for session: ${sessionId}`);

    try {
      // Processar a requisição usando o LLMService
      const response = await this.llmService.generateResponse('gemini', request);
      
      const processingTime = Date.now() - startTime;
      
      this.logger.log(`LLM job completed successfully: ${job.id} in ${processingTime}ms`);

      return {
        success: true,
        response,
        processingTime,
        retryCount: job.attemptsMade,
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      this.logger.error(`LLM job failed: ${job.id} - ${error.message}`);
      
      return {
        success: false,
        error: error.message,
        processingTime,
        retryCount: job.attemptsMade,
      };
    }
  }
} 