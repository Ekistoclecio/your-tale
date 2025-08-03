'use client';

import { Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { MotionCard } from '../../atoms/MotionCard';
import { Avatar } from '../../atoms/Avatar';
import * as S from './styles';
import { EditableField } from '@/components/molecules/EditableField';
import { useUpdateUser } from '@/queries/users/mutation';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface UserProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
}

export const UserProfileModal = ({ open, onClose, user }: UserProfileModalProps) => {
  const { mutateAsync: updateUser } = useUpdateUser();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, update } = useSession();
  const handleSaveField = async (field: 'name' | 'email', value: string) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const updatedUser = { [field]: value } as { name?: string; email?: string };
      const user = await updateUser(updatedUser);
      enqueueSnackbar('Usuário atualizado com sucesso', { variant: 'success' });
      await update({
        user: {
          ...session?.user,
          email: user.email,
          name: user.name,
        },
      });
    } catch {
      enqueueSnackbar('Erro ao atualizar usuário, por favor tente novamente mais tarde.', {
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <S.ModalContainer open={open} onClose={handleClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <MotionCard>
              <S.Header>
                <Typography variant="h4">Perfil do Usuário</Typography>
              </S.Header>

              <S.AvatarContainer>
                <Avatar
                  src={user.avatar}
                  sx={{ width: 80, height: 80 }}
                  animationVariant="subtleBounce"
                />
              </S.AvatarContainer>

              <S.FieldsContainer>
                <EditableField
                  label="Nome"
                  value={user.name}
                  field="name"
                  onSave={handleSaveField}
                  loading={isLoading}
                />

                <EditableField
                  label="Email"
                  value={user.email}
                  field="email"
                  onSave={handleSaveField}
                  loading={isLoading}
                />
              </S.FieldsContainer>

              <S.Actions>
                <S.CloseButton
                  animationVariant="subtleBounce"
                  variant="outlined"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Fechar
                </S.CloseButton>
              </S.Actions>
            </MotionCard>
          </motion.div>
        </S.ModalContainer>
      )}
    </AnimatePresence>
  );
};
