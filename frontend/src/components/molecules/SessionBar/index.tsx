'use client';

import { Typography, IconButton, Tooltip, useTheme } from '@mui/material';
import { GroupAddRounded as InviteIcon } from '@mui/icons-material';
import { ButtonStartSession } from '@/components/atoms';
import * as S from './styles';
import { SessionInviteModal } from '../SessionInviteModal';
import { useState } from 'react';

type SessionStatus = 'not_started' | 'active' | 'paused' | 'ended';

interface SessionBarProps {
  title: string;
  status: SessionStatus;
  isMaster?: boolean;
  onStartSession?: () => void;
  joinCode: string;
}

export const SessionBar = ({
  title,
  status,
  isMaster = false,
  onStartSession,
  joinCode,
}: SessionBarProps) => {
  const theme = useTheme();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [isLoadingStartSession, setIsLoadingStartSession] = useState(false);
  const getStatusText = () => {
    switch (status) {
      case 'not_started':
        return 'Aguardando';
      case 'active':
        return 'Ativa';
      case 'ended':
        return 'Finalizada';
    }
  };

  return (
    <>
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

          {/* {!isMaster && (
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
          )} */}
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
                  onClick={() => setInviteModalOpen(true)}
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
                onClick={async () => {
                  setIsLoadingStartSession(true);
                  await onStartSession?.();
                  setIsLoadingStartSession(false);
                }}
                loading={isLoadingStartSession}
                size="small"
              />
            </>
          )}
        </S.RightSection>
      </S.SessionBarContainer>
      <SessionInviteModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        sessionTitle={title}
        joinCode={joinCode}
      />
    </>
  );
};
