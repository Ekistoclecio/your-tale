import { LLMRequest } from './llm.interface';

export interface LLMQueueJob {
  id: string;
  sessionId: string;
  userId: string;
  request: LLMRequest;
  priority?: number;
  retryCount?: number;
  maxRetries?: number;
}

export interface LLMQueueResult {
  success: boolean;
  response?: any;
  error?: string;
  processingTime?: number;
  retryCount?: number;
}

export interface QueueConfig {
  concurrency: number;
  maxRetries: number;
  backoffDelay: number;
  rateLimit?: {
    max: number;
    duration: number;
  };
} 