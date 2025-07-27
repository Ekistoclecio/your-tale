import { Controller, Get, Post, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LLMQueueService } from '../providers/llm-queue.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Queue Management')
@Controller('queue')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class QueueController {
  constructor(private readonly llmQueueService: LLMQueueService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get queue statistics' })
  @ApiResponse({ status: 200, description: 'Queue statistics retrieved successfully' })
  async getQueueStats() {
    return await this.llmQueueService.getQueueStats();
  }

  @Get('job/:jobId')
  @ApiOperation({ summary: 'Get job status by ID' })
  @ApiResponse({ status: 200, description: 'Job status retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async getJobStatus(@Param('jobId') jobId: string) {
    return await this.llmQueueService.getJobStatus(jobId);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Clear all jobs from the queue' })
  @ApiResponse({ status: 200, description: 'Queue cleared successfully' })
  async clearQueue() {
    await this.llmQueueService.clearQueue();
    return { message: 'Queue cleared successfully' };
  }

  @Get('health')
  @ApiOperation({ summary: 'Check queue health status' })
  @ApiResponse({ status: 200, description: 'Queue health check completed' })
  async healthCheck() {
    const stats = await this.llmQueueService.getQueueStats();
    
    const isHealthy = stats.failed === 0 && stats.active < 10;
    
    return {
      status: isHealthy ? 'healthy' : 'warning',
      timestamp: new Date().toISOString(),
      stats,
      recommendations: isHealthy ? [] : [
        'Consider increasing worker concurrency if active jobs are high',
        'Check failed jobs for potential issues',
      ],
    };
  }
} 