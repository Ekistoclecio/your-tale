import { QueryClient } from '@tanstack/react-query';

export const MINUTE = 60 * 1000;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: 1,
      staleTime: 15 * MINUTE,
      gcTime: 15 * MINUTE,
    },
  },
});
