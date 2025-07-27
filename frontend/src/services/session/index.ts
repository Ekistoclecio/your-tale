
import { Session } from '@/schemas/entities/session';
import { ApiService } from '@/services/client';

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
}

export const sessionService = new SessionService();
