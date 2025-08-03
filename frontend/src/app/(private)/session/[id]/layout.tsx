'use client';

import Loading from '@/components/molecules/Loading';
import { useVerifyCharacterInSessionQuery } from '@/queries/session/queries';
import { Box } from '@mui/material';
import { AxiosError } from 'axios';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { ReactNode } from 'react';

interface SessionLayoutProps {
  children: ReactNode;
}

export default function SessionLayout({ children }: SessionLayoutProps) {
  const { id } = useParams<{ id: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const pathname = usePathname();

  const isSessionRoot = pathname === `/session/${id}`;

  const { error, isLoading } = useVerifyCharacterInSessionQuery(id);

  if (error && isSessionRoot) {
    const axiosError = error as AxiosError<{ errorCode: string }>;
    if (axiosError.response?.data?.errorCode === 'CHARACTER_NOT_FOUND') {
      return router.push(`/session/${id}/create_character`);
    } else if (!axiosError.response?.data?.errorCode) {
      enqueueSnackbar('Erro ao conectar a sessão, por favor tente novamente mais tarde.', {
        variant: 'error',
      });
      return router.push(`/`);
    }
  }

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Loading />
      </Box>
    );

  return <>{children}</>;
}
