import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Message } from '../entities/message.entity';
import { LLMQueueService } from '../providers/llm-queue.service';
import { LLMWorker } from '../workers/llm.worker';
import { QueueController } from '../controllers/queue.controller';
import { LLMModule } from './llm.module';
import { ChatModule } from './chat.module';
import { QueueResultService } from '../providers/queue-result.service';

@Module({
  imports: [
    ConfigModule,
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
    forwardRef(() => ChatModule),
  ],
  controllers: [QueueController],
  providers: [
    LLMQueueService, 
    LLMWorker,
    QueueResultService,
  ],
  exports: [LLMQueueService, BullModule, QueueResultService],
})
export class QueueModule {} 