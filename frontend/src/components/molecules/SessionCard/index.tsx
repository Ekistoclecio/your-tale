'use client';

import { MotionButton } from '@/components/atoms';
import { Box, Skeleton, Stack } from '@mui/material';
import { MotionCard } from '../../atoms/MotionCard';
import { Badge } from '../../atoms/Badge';
import { Avatar } from '../../atoms/Avatar';
import * as S from './styles';
import { Session } from '@/schemas/entities/session';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SessionCardProps {
  session: Session;
  isMySessions?: boolean;
}

export const SessionCardSkeleton = () => (
  <MotionCard cardVariant="session" sx={{ p: 3, height: 200 }}>
    <Skeleton variant="text" width="60%" height={32} />
    <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
    <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 2 }} />
    <Skeleton variant="rectangular" width="120px" height={40} sx={{ mt: 2 }} />
  </MotionCard>
);

export const SessionCard = ({ session, isMySessions = false }: SessionCardProps) => {
  const router = useRouter();
  const canEnterSession = useMemo(() => {
    return (
      (session.current_players < session.player_limit &&
        (session.status !== 'active' ||
          (session.status === 'active' && session.join_after_start && !session.is_ai_master))) ||
      isMySessions
    );
  }, [session, isMySessions]);

  const getStatusText = () => {
    if (session.status === 'active') {
      return <strong>Ativa</strong>;
    } else if (session.start_date && session.status === 'not_started') {
      return (
        <strong>
          Agendada para{' '}
          {format(new Date(session.start_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
        </strong>
      );
    } else if (session.status === 'ended') {
      return <strong>Encerrada</strong>;
    }
    return <strong>Não iniciada</strong>;
  };

  const handleEnterSession = () => {
    if (isMySessions) {
      router.push(`/session/${session.id}`);
    } else {
      router.push(`/session/${session.id}/create_character`);
    }
  };

  return (
    <S.Card cardVariant="session">
      <S.Container>
        <Box>
          <S.Title variant="h4">{session.title}</S.Title>

          <Stack direction="row" alignItems="center" gap={3} my={3}>
            <S.MasterInfo>
              <Avatar
                src={session.creator?.avatar}
                alt={
                  session.creator?.name ?? (session.is_ai_master ? 'Mestre IA' : 'Mestre humano')
                }
                sx={{ width: 28, height: 28, backgroundColor: 'primary.main' }}
              />
              <S.MasterName variant="body2">{session.creator?.name ?? 'Mestre IA'}</S.MasterName>
            </S.MasterInfo>
            <Badge badgeVariant={session.is_ai_master ? 'ai' : 'human'} />
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
          {canEnterSession && (
            <MotionButton variant="contained" onClick={handleEnterSession}>
              {isMySessions ? 'Ir para sessão' : 'Entrar na sessão'}
            </MotionButton>
          )}

          {/* {isMySessions && (
            <S.CharacterButton variant="outlined" onClick={() => onViewCharacter?.(session.id)}>
              Ver ficha
            </S.CharacterButton>
          )} */}
        </S.ActionsBox>
      </S.Container>
    </S.Card>
  );
};
