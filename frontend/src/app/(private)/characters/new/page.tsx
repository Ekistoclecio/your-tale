'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Snackbar } from '@mui/material';
import { CharacterFormTemplate } from '@/components/templates/CharacterFormTemplate';
import { CreateCharacterFormData } from '@/schemas/form-validation/createCharacterForm';

export default function CreateCharacterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleSubmit = async (data: CreateCharacterFormData) => {
    setIsLoading(true);

    try {
      // TODO: Implementar chamada para API
      console.log('Dados do personagem:', data);

      // Simular delay da API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSnackbar({
        open: true,
        message: 'Personagem criado com sucesso!',
        severity: 'success',
      });

      // Redirecionar para a lista de personagens após um delay
      setTimeout(() => {
        router.push('/characters');
      }, 1500);
    } catch (error) {
      console.error('Erro ao criar personagem:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao criar personagem. Tente novamente.',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <CharacterFormTemplate onSubmit={handleSubmit} isLoading={isLoading} />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
