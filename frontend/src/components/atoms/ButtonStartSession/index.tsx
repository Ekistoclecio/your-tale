'use client';

import { CircularProgress, useTheme } from '@mui/material';
import {
  PlayArrowRounded as PlayIcon,
  PauseRounded as PauseIcon,
  StopRounded as StopIcon,
} from '@mui/icons-material';
import * as S from './styles';

export type SessionStatus = 'not_started' | 'active' | 'paused' | 'ended';

export interface ButtonStartSessionProps {
  status: SessionStatus;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const ButtonStartSession = ({
  status,
  onClick,
  disabled = false,
  loading = false,
  size = 'medium',
}: ButtonStartSessionProps) => {
  const theme = useTheme();

  const buttonConfigs = {
    not_started: { text: 'Iniciar Sessão', icon: <PlayIcon />, color: theme.palette.success.main },
    active: { text: 'Pausar Sessão', icon: <PauseIcon />, color: theme.palette.warning.main },
    paused: { text: 'Retomar Sessão', icon: <PlayIcon />, color: theme.palette.info.main },
    ended: { text: 'Sessão Finalizada', icon: <StopIcon />, color: theme.palette.error.main },
  };

  const config = buttonConfigs[status] || buttonConfigs.not_started;
  const isEndedSession = status === 'ended';

  return (
    <S.StyledButton
      btncolor={config.color}
      customgradient={status !== 'not_started' && !isEndedSession}
      ended={isEndedSession}
      variant="contained"
      size={size}
      startIcon={!loading ? config.icon : undefined}
      onClick={onClick}
      disabled={disabled || loading || isEndedSession}
    >
      {loading ? <CircularProgress size={20} /> : config.text}
    </S.StyledButton>
  );
};
