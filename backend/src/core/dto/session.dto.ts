import { IsString, IsBoolean, IsInt, IsOptional, IsDateString, IsEnum, Min, ValidateIf, IsUUID, IsObject } from 'class-validator';
import { SessionStatus } from '../entities/session.entity';

export class CreateSessionDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  is_public?: boolean;

  @IsOptional()
  @IsBoolean()
  join_after_start?: boolean;

  @IsInt()
  @Min(1)
  player_limit: number;

  @IsOptional()
  @IsBoolean()
  is_ai_master?: boolean;

  @IsDateString()
  start_date: string;

  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}

export class UpdateSessionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  is_public?: boolean;

  @IsOptional()
  @IsBoolean()
  join_after_start?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  player_limit?: number;

  @IsOptional()
  @IsBoolean()
  is_ai_master?: boolean;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;

  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}

export class JoinSessionDto {
  @IsString()
  join_code: string;
} 