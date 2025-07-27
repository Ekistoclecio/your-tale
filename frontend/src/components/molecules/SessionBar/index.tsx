'use client';

import { Typography, IconButton, Tooltip, useTheme } from '@mui/material';
import { GroupAddRounded as InviteIcon, InfoRounded as InfoIcon } from '@mui/icons-material';
import { ButtonStartSession } from '@/components/atoms';
import * as S from './styles';

type SessionStatus = 'not_started' | 'active' | 'paused' | 'ended';

interface SessionBarProps {
  title: string;
  status: SessionStatus;
  isMaster?: boolean;
  onStartSession?: () => void;
  onInvitePlayer?: () => void;
  onShowInfo?: () => void;
  loading?: boolean;
}

export const SessionBar = ({
  title,
  status,
  isMaster = false,
  onStartSession,
  onInvitePlayer,
  onShowInfo,
  loading = false,
}: SessionBarProps) => {
  const theme = useTheme();

  const getStatusText = () => {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'paused':
        return 'Pausada';
      case 'ended':
        return 'Finalizada';
      default:
        return 'Aguardando';
    }
  };

  return (
    <S.SessionBarContainer
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <S.LeftSection>
        <S.SessionStatus status={status}>
          <S.StatusIndicator status={status} />
          <Typography variant="button" color="text.secondary">
            {getStatusText()}
          </Typography>
        </S.SessionStatus>

        {!isMaster && (
          <Tooltip title="Informações da sessão" arrow>
            <IconButton
              size="small"
              onClick={onShowInfo}
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.secondary.main,
                  backgroundColor: `${theme.palette.secondary.main}10`,
                },
              }}
            >
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </S.LeftSection>

      <S.CenterSection>
        <S.SessionTitle variant="h5">{title}</S.SessionTitle>
      </S.CenterSection>

      <S.RightSection>
        {isMaster && (
          <>
            <Tooltip title="Convidar jogador" arrow>
              <IconButton
                size="small"
                onClick={onInvitePlayer}
                sx={{
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    color: theme.palette.secondary.main,
                    backgroundColor: `${theme.palette.secondary.main}10`,
                  },
                }}
              >
                <InviteIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <ButtonStartSession
              status={status}
              onClick={onStartSession || (() => {})}
              loading={loading}
              size="small"
            />
          </>
        )}
      </S.RightSection>
    </S.SessionBarContainer>
  );
};
