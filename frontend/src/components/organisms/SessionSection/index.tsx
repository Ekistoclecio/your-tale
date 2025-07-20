'use client';

import { Stack } from '@mui/material';
import { SessionCard, SessionCardSkeleton } from '../../molecules/SessionCard';
import * as S from './styles';
import { Theme, useTheme } from '@mui/material/styles';
import { Variants } from 'framer-motion';

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

interface SessionSectionProps {
  title: string;
  icon?: React.ReactNode;
  sessions: Session[];
  loading?: boolean;
  emptyState?: React.ReactNode;
  onEnterSession?: (id: string) => void;
  onViewCharacter?: (id: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  id: string;
}

export const getSectionVariants = (theme: Theme): Variants => ({
  initial: {
    scale: 1,
    boxShadow: `0 2px 16px 0 ${theme.palette.secondary.main}33`,
    borderColor: theme.palette.primary.dark,
    background: `linear-gradient(135deg, ${theme.palette.primary.dark}4D 0%, ${theme.palette.secondary.main}33 100%)`,
    transition: { duration: 0.2 },
  },
  hovered: {
    scale: 1.01,
    boxShadow: `0 0 24px 4px ${theme.palette.secondary.main}40`,
    borderColor: theme.palette.secondary.main,
    background: `linear-gradient(135deg, ${theme.palette.secondary.main}1A 0%, ${theme.palette.secondary.main}0D 100%)`,
    transition: { duration: 0.2 },
  },
  focused: {
    scale: 1.02,
    boxShadow: `0 0 32px 8px ${theme.palette.secondary.main}59`,
    borderColor: theme.palette.secondary.light,
    background: `linear-gradient(135deg, ${theme.palette.secondary.main}22 0%, ${theme.palette.secondary.main}14 100%)`,
    transition: { duration: 0.2 },
  },
});

export const SessionSection = ({
  title,
  icon,
  sessions,
  loading = false,
  emptyState,
  onEnterSession,
  onViewCharacter,
  page,
  totalPages,
  onPageChange,
  id,
}: SessionSectionProps) => {
  const theme = useTheme();
  const sectionVariants = getSectionVariants(theme);
  return (
    <S.Container
      variants={sectionVariants}
      initial="initial"
      whileHover="hovered"
      whileFocus="focused"
      id={id}
    >
      <Stack direction="row" alignItems="center" spacing={2} justifyContent="center" mb={4}>
        {icon}
        <S.Title variant="h4">{title}</S.Title>
      </Stack>
      <S.List>
        {loading
          ? Array.from({ length: 3 }).map((_, index) => <SessionCardSkeleton key={index} />)
          : sessions.length > 0
            ? sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onEnterSession={onEnterSession}
                  onViewCharacter={onViewCharacter}
                />
              ))
            : emptyState || null}
      </S.List>

      {!loading && sessions.length > 0 && (
        <S.PaginationWrapper>
          <S.Pagination count={totalPages} page={page} onChange={(_, p) => onPageChange(p)} />
        </S.PaginationWrapper>
      )}
    </S.Container>
  );
};
