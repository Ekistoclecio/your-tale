import { DEFAULT_LIMIT, queryClient } from '@/queries/client';
import { sessionService } from '@/services/session';

export const fetchGetPublicSessions = (page: number, limit: number = DEFAULT_LIMIT) => {
  return queryClient.fetchQuery({
    queryKey: ['sessions', 'public', page, limit],
    queryFn: () => sessionService.getPublicSessions(page, limit),
  });
};

export const fetchGetMySessions = (page: number, limit: number = DEFAULT_LIMIT) => {
  return queryClient.fetchQuery({
    queryKey: ['sessions', 'my', page, limit],
    queryFn: () => sessionService.getMySessions(page, limit),
  });
};

export const fetchGetSessionIdByCode = (code: string) => {
  return queryClient.fetchQuery({
    queryKey: ['sessions', 'code', code],
    queryFn: () => sessionService.getSessionIdByCode(code),
  });
};
