'use client';

import { Typography, IconButton, Snackbar, Alert, useTheme } from '@mui/material';
import { useState } from 'react';
import {
  ContentCopyRounded as CopyIcon,
  GroupAddRounded as InviteIcon,
  InfoRounded as InfoIcon,
} from '@mui/icons-material';
import { AnimatePresence } from 'framer-motion';
import * as S from './styles';

interface SessionInviteModalProps {
  open: boolean;
  onClose: () => void;
  sessionTitle: string;
  joinCode: string;
}

export const SessionInviteModal = ({
  open,
  onClose,
  sessionTitle,
  joinCode,
}: SessionInviteModalProps) => {
  const theme = useTheme();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(joinCode);
      setSnackbar({
        open: true,
        message: 'Código copiado para a área de transferência!',
        severity: 'success',
      });
    } catch {
      setSnackbar({ open: true, message: 'Erro ao copiar código', severity: 'error' });
    }
  };

  return (
    <>
      <AnimatePresence>
        <S.ModalContainer open={open} onClose={onClose}>
          <S.Card animationVariant="subtleBounce">
            <S.Header>
              <InviteIcon sx={{ color: theme.palette.secondary.main }} />
              <Typography variant="h6" fontWeight={700}>
                Convidar Jogadores
              </Typography>
            </S.Header>

            <S.Description variant="body1">
              Compartilhe este código ou link para convidar jogadores para &quot;
              <b>{sessionTitle}</b>&quot;
            </S.Description>

            <S.CodeContainer>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <S.CodeLabel variant="caption">Código da Sessão</S.CodeLabel>
                <S.CodeText>{joinCode}</S.CodeText>
              </div>
              <IconButton onClick={handleCopyCode} color="secondary">
                <CopyIcon />
              </IconButton>
            </S.CodeContainer>

            <S.InfoBox>
              <InfoIcon sx={{ color: theme.palette.info.light }} />
              <Typography variant="body2" sx={{ color: theme.palette.common.white }}>
                Os jogadores podem usar o código na tela inicial para entrar na sessão.
              </Typography>
            </S.InfoBox>

            <S.CloseButton variant="outlined" onClick={onClose}>
              Fechar
            </S.CloseButton>
          </S.Card>
        </S.ModalContainer>
      </AnimatePresence>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: theme.shape.borderRadiusMedium }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};
