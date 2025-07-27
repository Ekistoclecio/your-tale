import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../entities/message.entity';
import { LLMQueueService } from '../providers/llm-queue.service';
import { QueueResultService } from '../providers/queue-result.service';
import { LLMWorker } from '../workers/llm.worker';
import { QueueController } from '../controllers/queue.controller';
import { LLMModule } from './llm.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
          password: configService.get('REDIS_PASSWORD'),
          db: configService.get('REDIS_DB', 0),
        },
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 50,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 5000,
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'llm-processing',
      defaultJobOptions: {
        priority: 1,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
      },

    }),
    LLMModule,
  ],
  controllers: [QueueController],
  providers: [LLMQueueService, QueueResultService, LLMWorker],
  exports: [LLMQueueService, QueueResultService, BullModule],
})
export class QueueModule {} 