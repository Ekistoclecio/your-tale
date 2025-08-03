'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CharacterFormTemplate } from '@/components/templates/CharacterFormTemplate';
import { CreateCharacterFormData } from '@/schemas/form-validation/createCharacterForm';
import { useSnackbar } from 'notistack';
import { useCreateCharacter, useRegisterMember } from '@/queries/character/mutation';
import axios from 'axios';

export default function CreateCharacterPage() {
  const { id } = useParams<{ id: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: createCharacter } = useCreateCharacter();
  const { mutateAsync: registerMember } = useRegisterMember();

  const handleSubmit = async (data: CreateCharacterFormData) => {
    setIsLoading(true);

    const handleRegisterMember = async () => {
      try {
        await registerMember(id);
        return true;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 409) {
          return true;
        }
        enqueueSnackbar('Erro ao registrar membro. Tente novamente.', { variant: 'error' });
        return false;
      }
    };

    try {
      const isMemberRegistered = await handleRegisterMember();
      if (!isMemberRegistered) {
        return;
      }
      await createCharacter({ ...data, session_id: id });

      enqueueSnackbar('Personagem criado com sucesso!', { variant: 'success' });

      router.push(`/session/${id}`);
    } catch (error) {
      console.error('Erro ao criar personagem:', error);
      enqueueSnackbar('Erro ao criar personagem. Tente novamente.', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CharacterFormTemplate onSubmit={handleSubmit} isLoading={isLoading} />
    </>
  );
}
