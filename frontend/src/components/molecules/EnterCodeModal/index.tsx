'use client';

import { useState } from 'react';
import { Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { MotionCard } from '../../atoms/MotionCard';
import Key from '@/assets/icons/key.svg';
import * as S from './styles';

interface EnterCodeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
  loading?: boolean;
}

export const EnterCodeModal = ({
  open,
  onClose,
  onSubmit,
  loading = false,
}: EnterCodeModalProps) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!code.trim()) return setError('Digite o código da sessão');
    if (code.trim().length < 6) return setError('O código deve ter pelo menos 6 caracteres');

    setError('');
    onSubmit(code.trim());
  };

  const handleClose = () => {
    setCode('');
    setError('');
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
            <MotionCard animationVariant="subtleBounce">
              <S.Header>
                <Key width={28} height={28} />
                <Typography variant="h4">Entrar com Código</Typography>
              </S.Header>

              <Typography variant="body1" color="text.secondary" mb={3}>
                Digite o código da sessão para entrar na aventura
              </Typography>

              <S.CenteredTextField
                fullWidth
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Digite o código da sessão"
                error={!!error}
                helperText={error}
                disabled={loading}
              />

              <S.Actions>
                <S.CancelButton
                  animationVariant="subtleBounce"
                  variant="outlined"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancelar
                </S.CancelButton>

                <S.SubmitButton
                  animationVariant="subtleBounce"
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </S.SubmitButton>
              </S.Actions>
            </MotionCard>
          </motion.div>
        </S.ModalContainer>
      )}
    </AnimatePresence>
  );
};
