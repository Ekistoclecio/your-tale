'use client';

import { theme } from '@/theme';
import { globalStyles } from '@/theme/base/globalStyles';
import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { ConfiguredSnackbarProvider } from './snackbar';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/queries/client';
import { SessionProvider } from 'next-auth/react';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={globalStyles} />
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
          <QueryClientProvider client={queryClient}>
            <SessionProvider>
              <ConfiguredSnackbarProvider>{children}</ConfiguredSnackbarProvider>
            </SessionProvider>
          </QueryClientProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
