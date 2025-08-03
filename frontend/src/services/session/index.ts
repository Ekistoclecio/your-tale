import { Note } from '@/schemas/entities/notes';
import { Session } from '@/schemas/entities/session';
import { CreateSessionFormData } from '@/schemas/form-validation/createSessionForm';
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

  verifyCharacterInSession = async (sessionId: string) => {
    const { data } = await this.get<void>(`${sessionId}/validate-character`);
    return data;
  };

  createSession = async (data: CreateSessionFormData) => {
    const { data: session } = await this.post<Session>('', data);
    return session;
  };

  registerMember = async (sessionId: string) => {
    const { data } = await this.post<Session>(`${sessionId}/members/join`, {});
    return data;
  };

  getSessionNotes = async (sessionId: string) => {
    const { data } = await this.get<{ data: Note[] }>(`${sessionId}/notes`, {
      params: {
        page: 1,
        limit: 9999,
      },
    });
    return data;
  };

  createSessionNote = async (sessionId: string, data: Omit<Note, 'id'>) => {
    const { data: note } = await this.post<Note>(`${sessionId}/notes`, data);
    return note;
  };

  deleteSessionNote = async (noteId: string) => {
    const { data } = await this.delete<Note>(`/notes/${noteId}`);
    return data;
  };

  updateSessionNote = async (noteId: string, data: Omit<Note, 'id'>) => {
    const { data: note } = await this.put<Note>(`/notes/${noteId}`, data);
    return note;
  };

  getPublicSessions = async (page: number, limit: number) => {
    const { data } = await this.get<{ data: Session[]; totalPages: number; currentPage: number }>(
      'public',
      {
        params: {
          page,
          limit,
        },
      }
    );
    return data;
  };

  getMySessions = async (page: number, limit: number) => {
    const { data } = await this.get<{ data: Session[]; totalPages: number; currentPage: number }>(
      'my',
      {
        params: {
          page,
          limit,
        },
      }
    );
    return data;
  };

  getSessionIdByCode = async (code: string) => {
    const { data } = await this.get<{ id: string }>(`by-code/${code}`);
    return data;
  };

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
    queryParams.append('limit', '9999');

    const queryString = queryParams.toString();
    const url = `${sessionId}/messages${queryString ? `?${queryString}` : ''}`;

    const { data } = await this.get<{ data: Message[] }>(url);
    return data;
  };

  sendMessage = async (sessionId: string, content: string) => {
    const { data: message } = await this.post<Message>(`${sessionId}/messages`, {
      content: content,
      chat_type: 'master',
      type: 'user',
    });
    return message;
  };
}

export const sessionService = new SessionService();
