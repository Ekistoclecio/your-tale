import { useQuery } from '@tanstack/react-query';
import { sessionService } from '@/services/session';

export const useSessionByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['session', id],
    queryFn: () => sessionService.getSessionById(id),
  });
};