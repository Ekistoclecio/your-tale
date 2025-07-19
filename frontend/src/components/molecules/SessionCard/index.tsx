'use client';

import { MotionButton } from '@/components/atoms';
import { Box, Skeleton, Stack } from '@mui/material';
import { MotionCard } from '../../atoms/MotionCard';
import { Badge } from '../../atoms/Badge';
import { Avatar } from '../../atoms/Avatar';
import * as S from './styles';

interface Session {
  id: string;
  name: string;
  description?: string;
  master: {
    name: string;
    avatar?: string;
    type: 'ai' | 'human';
  };
  status: 'active' | 'ended' | 'scheduled';
  lastAccess?: string;
  scheduledDate?: string;
  connected?: boolean;
}

interface SessionCardProps {
  session: Session;
  onEnterSession?: (sessionId: string) => void;
  onViewCharacter?: (sessionId: string) => void;
}

export const SessionCardSkeleton = () => (
  <MotionCard cardVariant="session" sx={{ p: 3, height: 200 }}>
    <Skeleton variant="text" width="60%" height={32} />
    <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
    <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 2 }} />
    <Skeleton variant="rectangular" width="120px" height={40} sx={{ mt: 2 }} />
  </MotionCard>
);

export const SessionCard = ({ session, onEnterSession, onViewCharacter }: SessionCardProps) => {
  const getStatusText = () => {
    if (session.status === 'scheduled' && session.scheduledDate) {
      return <strong>Agendada para {session.scheduledDate}</strong>;
    }
    return session.lastAccess ? <strong>Último acesso: {session.lastAccess}</strong> : '';
  };

  return (
    <S.Card cardVariant="session">
      <S.Container>
        <Box>
          <S.Title variant="h4">{session.name}</S.Title>

          <Stack direction="row" alignItems="center" gap={3} my={3}>
            <S.MasterInfo>
              <Avatar
                src={session.master.avatar}
                alt={session.master.name}
                sx={{ width: 28, height: 28, backgroundColor: 'primary.main' }}
              />
              <S.MasterName variant="body2">{session.master.name}</S.MasterName>
            </S.MasterInfo>
            <Badge badgeVariant={session.master.type} />
          </Stack>

          <S.DescriptionBox>
            <S.Description variant="body2">
              {session.description ?? <i>Sem descrição</i>}
            </S.Description>
          </S.DescriptionBox>

          <S.StatusBox>
            <Badge badgeVariant={session.status} />
            {getStatusText() && <S.StatusText variant="caption">{getStatusText()}</S.StatusText>}
          </S.StatusBox>
        </Box>

        <S.ActionsBox>
          <MotionButton variant="contained" onClick={() => onEnterSession?.(session.id)}>
            Entrar nesta sessão
          </MotionButton>

          {session.connected && (
            <S.CharacterButton variant="outlined" onClick={() => onViewCharacter?.(session.id)}>
              Ver ficha
            </S.CharacterButton>
          )}
        </S.ActionsBox>
      </S.Container>
    </S.Card>
  );
};
