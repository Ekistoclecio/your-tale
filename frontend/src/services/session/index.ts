
import { Session } from '@/schemas/entities/session';
import { ApiService } from '@/services/client';

export interface Message {
  id: string;
  sender_id: string;
  session_id: string;
  content: string;
  timestamp: string;
  type: 'user' | 'ai' | 'system';
  chat_type: 'general' | 'master';
  reply_to?: string | null;
  metadata?: Record<string, unknown> | null;
  sender?: {
    id: string;
    name: string;
    avatar?: string | null;
  };
}

export interface GetMessagesParams {
  chat_type?: 'general' | 'master';
  page?: number;
  limit?: number;
}

class SessionService extends ApiService {
  constructor() {
    super('sessions/');
  }

  getSessionById = async (id: string) => {
    const { data } = await this.get<Session>(`${id}`);
    return data;
  };

  startSession = async (id: string) => {
    const { data } = await this.post<Session>(`${id}/start`, {});
    return data;
  };

  getMessages = async (sessionId: string, params: GetMessagesParams = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.chat_type) {
      queryParams.append('chat_type', params.chat_type);
    }
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    queryParams.append('limit', "9999");

    const queryString = queryParams.toString();
    const url = `${sessionId}/messages${queryString ? `?${queryString}` : ''}`;
    
    const { data } = await this.get<Message[]>(url);
    return data;
  };
}

export const sessionService = new SessionService();
