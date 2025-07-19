import { IsString, IsEnum, IsOptional, IsUUID, IsObject, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MessageType, ChatType } from '../entities/message.entity';

export class CreateMessageDto {
  @ApiProperty({
    description: 'Conteúdo da mensagem',
    example: 'Olá, pessoal! Como estão todos?'
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: 'Tipo da mensagem',
    enum: MessageType,
    example: MessageType.USER
  })
  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;

  @ApiPropertyOptional({
    description: 'Tipo do chat onde a mensagem será enviada',
    enum: ChatType,
    example: ChatType.GENERAL
  })
  @IsOptional()
  @IsEnum(ChatType)
  chat_type?: ChatType;

  @ApiPropertyOptional({
    description: 'ID da mensagem que está sendo respondida',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsOptional()
  @IsUUID()
  reply_to?: string;

  @ApiPropertyOptional({
    description: 'Metadados adicionais da mensagem',
    example: { dice_roll: { result: 15, sides: 20 } }
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdateMessageDto {
  @ApiPropertyOptional({
    description: 'Novo conteúdo da mensagem',
    example: 'Mensagem atualizada!'
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @ApiPropertyOptional({
    description: 'Metadados adicionais da mensagem',
    example: { dice_roll: { result: 15, sides: 20 } }
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class MessageResponseDto {
  @ApiProperty({
    description: 'ID único da mensagem'
  })
  id: string;

  @ApiProperty({
    description: 'ID do usuário que enviou a mensagem'
  })
  sender_id: string;

  @ApiProperty({
    description: 'ID da sessão onde a mensagem foi enviada'
  })
  session_id: string;

  @ApiProperty({
    description: 'Conteúdo da mensagem'
  })
  content: string;

  @ApiProperty({
    description: 'Data e hora de envio da mensagem'
  })
  timestamp: Date;

  @ApiProperty({
    description: 'Tipo da mensagem',
    enum: MessageType
  })
  type: MessageType;

  @ApiProperty({
    description: 'Tipo do chat onde a mensagem foi enviada',
    enum: ChatType
  })
  chat_type: ChatType;

  @ApiPropertyOptional({
    description: 'ID da mensagem que está sendo respondida'
  })
  reply_to?: string | null;

  @ApiPropertyOptional({
    description: 'Metadados adicionais da mensagem'
  })
  metadata?: Record<string, any> | null;

  @ApiPropertyOptional({
    description: 'Informações do remetente'
  })
  sender?: {
    id: string;
    name: string;
    avatar?: string | null;
  };
}

export class GetMessagesQueryDto {
  @ApiPropertyOptional({
    description: 'Filtrar mensagens por tipo de chat',
    enum: ChatType,
    example: ChatType.GENERAL
  })
  @IsOptional()
  @IsEnum(ChatType)
  chat_type?: ChatType;

  @ApiPropertyOptional({
    description: 'Número da página para paginação',
    example: '1'
  })
  @IsOptional()
  @IsString()
  page?: string;

  @ApiPropertyOptional({
    description: 'Número de mensagens por página',
    example: '20'
  })
  @IsOptional()
  @IsString()
  limit?: string;
} 