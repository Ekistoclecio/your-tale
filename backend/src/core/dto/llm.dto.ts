import { IsString, IsArray, IsOptional, IsNumber, IsEnum, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LLMMessageDto {
  @ApiProperty({ enum: ['user', 'assistant', 'system'], description: 'Role of the message sender' })
  @IsEnum(['user', 'assistant', 'system'])
  role: 'user' | 'assistant' | 'system';

  @ApiProperty({ description: 'Content of the message' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: 'Timestamp of the message' })
  @IsOptional()
  timestamp?: Date;
}

export class LLMContextDto {
  @ApiPropertyOptional({ description: 'System prompt to guide the model behavior' })
  @IsOptional()
  @IsString()
  systemPrompt?: string;

  @ApiPropertyOptional({ description: 'Temperature for response randomness (0.0 to 2.0)', minimum: 0, maximum: 2 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @ApiPropertyOptional({ description: 'Maximum number of tokens in the response' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxTokens?: number;

  @ApiPropertyOptional({ description: 'Top-p sampling parameter (0.0 to 1.0)', minimum: 0, maximum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  topP?: number;

  @ApiPropertyOptional({ description: 'Top-k sampling parameter' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  topK?: number;

  @ApiPropertyOptional({ description: 'Stop sequences to end generation', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  stopSequences?: string[];
}

export class LLMRequestDto {
  @ApiProperty({ description: 'Array of messages in the conversation', type: [LLMMessageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LLMMessageDto)
  messages: LLMMessageDto[];

  @ApiPropertyOptional({ description: 'Context and parameters for the generation', type: LLMContextDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LLMContextDto)
  context?: LLMContextDto;
}

export class LLMUsageDto {
  @ApiProperty({ description: 'Number of tokens in the prompt' })
  promptTokens: number;

  @ApiProperty({ description: 'Number of tokens in the completion' })
  completionTokens: number;

  @ApiProperty({ description: 'Total number of tokens used' })
  totalTokens: number;
}

export class LLMMetadataDto {
  @ApiProperty({ description: 'Name of the model used' })
  model: string;

  @ApiPropertyOptional({ description: 'Reason why generation stopped' })
  finishReason?: string;
}

export class LLMResponseDto {
  @ApiProperty({ description: 'Generated response content' })
  content: string;

  @ApiPropertyOptional({ description: 'Token usage information', type: LLMUsageDto })
  usage?: LLMUsageDto;

  @ApiPropertyOptional({ description: 'Additional metadata about the response', type: LLMMetadataDto })
  metadata?: LLMMetadataDto;
}

export class GenerateResponseDto {
  @ApiProperty({ description: 'Name of the LLM provider to use' })
  @IsString()
  provider: string;

  @ApiProperty({ description: 'Request parameters', type: LLMRequestDto })
  @ValidateNested()
  @Type(() => LLMRequestDto)
  request: LLMRequestDto;
} 