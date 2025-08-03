import { useQuery } from '@tanstack/react-query';
import { sessionService } from '@/services/session';

export const useSessionByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['session', id],
    queryFn: () => sessionService.getSessionById(id),
  });
};

export const useVerifyCharacterInSessionQuery = (id: string) => {
  return useQuery({
    queryKey: ['session', id, 'verify-character'],
    queryFn: () => sessionService.verifyCharacterInSession(id),
    retry: false,
  });
};

export const useSessionAiChatMessagesQuery = (sessionId: string) => {
  return useQuery({
    queryKey: ['ai-chat-messages'],
    queryFn: () => sessionService.getMessages(sessionId, { chat_type: 'master' }),
  });
};
