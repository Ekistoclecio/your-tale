import { useQuery } from '@tanstack/react-query';
import { sessionService } from '@/services/session';

export const useSessionNotesQuery = (id: string) => {
  return useQuery({
    queryKey: ['notes'],
    queryFn: () => sessionService.getSessionNotes(id),
  });
};
