import { Socket } from 'socket.io';
import { User } from '../entities/user.entity';

export interface AuthenticatedSocket extends Socket {
  data: {
    user: User;
  };
}

export interface ChatMessage {
  sessionId: string;
  content: string;
  chat_type?: string;
  reply_to?: string;
  metadata?: Record<string, any>;
}

export interface SessionJoinData {
  sessionId: string;
}

export interface SessionLeaveData {
  sessionId: string;
}

export interface TypingData {
  sessionId: string;
}

export interface WebSocketResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
} 