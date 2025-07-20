'use client';

import { Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { MotionCard } from '../../atoms/MotionCard';
import { Avatar } from '../../atoms/Avatar';
import * as S from './styles';
import { EditableField } from '@/components/molecules/EditableField';

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface UserProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
  onSaveField: (field: 'name' | 'email', value: string) => void;
  loading?: boolean;
}

export const UserProfileModal = ({
  open,
  onClose,
  user,
  onSaveField,
  loading = false,
}: UserProfileModalProps) => {
  const handleSaveField = (field: 'name' | 'email', value: string) => {
    onSaveField(field, value);
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
                  loading={loading}
                />

                <EditableField
                  label="Email"
                  value={user.email}
                  field="email"
                  onSave={handleSaveField}
                  loading={loading}
                />
              </S.FieldsContainer>

              <S.Actions>
                <S.CloseButton
                  animationVariant="subtleBounce"
                  variant="outlined"
                  onClick={handleClose}
                  disabled={loading}
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
