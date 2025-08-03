'use client';

import Loading from '@/components/molecules/Loading';
import { useVerifyCharacterInSessionQuery } from '@/queries/session/queries';
import { Box } from '@mui/material';
import { AxiosError } from 'axios';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { ReactNode, useEffect } from 'react';

interface SessionLayoutProps {
  children: ReactNode;
}

export default function SessionLayout({ children }: SessionLayoutProps) {
  const { id } = useParams<{ id: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const pathname = usePathname();

  const isSessionRoot = pathname === `/session/${id}`;
  const isSessionCreateCharacter = pathname === `/session/${id}/create_character`;
  const { error, isLoading, isSuccess } = useVerifyCharacterInSessionQuery(id);
  useEffect(() => {
    if (error) {
      const axiosError = error as AxiosError<{ errorCode: string }>;
      const errorCode = axiosError.response?.data?.errorCode;

      if (errorCode === 'CHARACTER_NOT_FOUND') {
        router.push(`/session/${id}/create_character`);
      } else if (isSessionCreateCharacter && errorCode === 'MASTER_NO_CHARACTER_NEEDED') {
        router.push(`/session/${id}`);
      } else if (!errorCode && axiosError.response?.status === 400) {
        enqueueSnackbar('Erro ao conectar a sessão, por favor tente novamente mais tarde.', {
          variant: 'error',
        });
        router.push(`/`);
      } else if (isSessionRoot && axiosError.response?.status === 403) {
        router.push(`/session/${id}/create_character`);
      }
    }

    if (isSuccess) {
      if (isSessionCreateCharacter) {
        router.push(`/session/${id}`);
      }
    }
  }, [error, enqueueSnackbar, router, id, isSuccess]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Loading />
      </Box>
    );
  }

  return <>{children}</>;
}
