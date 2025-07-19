import { IsString, IsOptional, IsObject, IsBoolean, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateCharacterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  session_id: string;

  @IsOptional()
  @IsObject()
  status?: Record<string, any>;

  @IsOptional()
  @IsObject()
  character_sheet?: Record<string, any>;

  @IsOptional()
  @IsString()
  character_class?: string;
}

export class UpdateCharacterStatusDto {
  @IsObject()
  status: Record<string, any>;
}

export class UpdateCharacterDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsObject()
  status?: Record<string, any>;

  @IsOptional()
  @IsObject()
  character_sheet?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsString()
  character_class?: string;
} 