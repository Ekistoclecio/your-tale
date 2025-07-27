'use client';

import { Box, Card, Typography, styled } from '@mui/material';
import { motion } from 'framer-motion';

export const PlayerListContainer = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: `${theme.palette.background.card}20`,
  border: `1px solid ${theme.palette.secondary.main}40`,
  borderRadius: theme.shape.borderRadiusMedium,
  backdropFilter: 'blur(10px)',
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

export const PlayerItem = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  backgroundColor: `${theme.palette.primary.main}10`,
  border: `1px solid ${theme.palette.primary.main}30`,
  borderRadius: theme.shape.borderRadiusSmall,
  marginBottom: theme.spacing(1),
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: `${theme.palette.primary.main}20`,
    borderColor: theme.palette.secondary.main,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadowsCustom?.sm(theme.palette.secondary.main) || '0 0 5px rgba(0,0,0,0.3)',
  },
  '&:last-child': {
    marginBottom: 0,
  },
}));

export const PlayerInfo = styled(Box)({
  flex: 1,
  minWidth: 0,
});

export const PlayerName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  fontSize: '0.875rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  width: 'fit-content',
  maxWidth: '100%',
}));

export const StatsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  minWidth: 120,
}));

export const StatusContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
});

export const ScrollArea = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingRight: theme.spacing(0.5),
  '&::-webkit-scrollbar': { width: 6 },
  '&::-webkit-scrollbar-track': {
    background: `${theme.palette.background.input}50`,
    borderRadius: 3,
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.secondary.main,
    borderRadius: 3,
    '&:hover': { background: theme.palette.secondary.dark },
  },
}));

// --- Header Section ---
export const HeaderWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginBottom: '16px',
});

export const HeaderTitleWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

export const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontFamily: `'Cinzel', serif`,
  color: theme.palette.text.primary,
  textShadow: '0 0 6px rgba(255,255,255,0.2)',
  fontWeight: 700,
  letterSpacing: 1,
}));

export const PlayerCount = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(145deg, ${theme.palette.secondary.dark}, ${theme.palette.secondary.main})`,
  width: 26,
  height: 26,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  color: '#fff',
  fontSize: 13,
  fontWeight: 600,
  boxShadow: `0 0 5px ${theme.palette.secondary.main}`,
}));

// --- Status Tags ---
export const StatusTag = styled(Box)<{ type: 'online' | 'offline' }>(({ theme, type }) => {
  const color = type === 'online' ? theme.palette.success.main : theme.palette.error.main;
  const text = type === 'online' ? theme.palette.success.light : theme.palette.error.light;
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '0.6em 1em',
    borderRadius: '999px',
    background: `rgba(0,0,0,0.3)`,
    border: `1px solid ${color}`,
    boxShadow: `0 0 8px ${color}60`,
    backdropFilter: 'blur(3px)',
    '& span': {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: color,
      boxShadow: `0 0 5px ${color}`,
    },
    '& p': {
      color: text,
      fontWeight: 500,
    },
  };
});

export const EmptyState = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4),
  color: theme.palette.text.secondary,
}));
