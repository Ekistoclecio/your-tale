import { IsString, IsOptional, IsNotEmpty, IsBoolean, IsArray } from 'class-validator';

export class CreateNoteDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsBoolean()
  is_private?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateNoteDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @IsOptional()
  @IsBoolean()
  is_private?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class NoteResponseDto {
  id: string;
  title: string | null;
  content: string;
  is_private: boolean;
  tags: string[] | null;
  session_id: string;
  author_id: string;
  created_at: Date;
  updated_at: Date;
  author?: {
    id: string;
    name: string;
    avatar?: string | null;
  };
}

export class GetNotesQueryDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsBoolean()
  include_private?: string;

  @IsOptional()
  @IsString()
  search?: string;
} 