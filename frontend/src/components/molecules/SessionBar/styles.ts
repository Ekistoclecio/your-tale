'use client';

import { Box, Theme, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const statusColors = (theme: Theme) => ({
  active: theme.palette.success.main,
  not_started: theme.palette.info.main,
  ended: theme.palette.error.main,
});

export const SessionBarContainer = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 3),
  backgroundColor: `${theme.palette.background.header}90`,
  backdropFilter: 'blur(10px)',
  borderBottom: `2px solid ${theme.palette.secondary.main}40`,
  borderRadius: `${theme.shape.borderRadiusMedium}px ${theme.shape.borderRadiusMedium}px 0 0`,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light}, ${theme.palette.secondary.main})`,
  },
}));

export const SessionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 700,
  fontSize: '1.25rem',
  textAlign: 'center',
  textShadow: `0 2px 4px ${theme.palette.common.black}40`,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '500px',
}));

export const LeftSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  flex: 1,
});

export const CenterSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 2,
});

export const RightSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flex: 1,
  justifyContent: 'flex-end',
});

export const SessionStatus = styled(Box)<{ status: string }>(({ theme, status }) => {
  const color =
    statusColors(theme)[status as keyof ReturnType<typeof statusColors>] ||
    statusColors(theme).not_started;
  return {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadiusSmall,
    backgroundColor: `${color}20`,
    color,
    border: `1px solid ${color}40`,
  };
});

export const StatusIndicator = styled(Box)<{ status: string }>(({ theme, status }) => {
  const color =
    statusColors(theme)[status as keyof ReturnType<typeof statusColors>] ||
    statusColors(theme).not_started;
  return {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: color,
    animation: status === 'active' ? 'pulse 2s infinite' : 'none',
    '@keyframes pulse': {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 },
    },
  };
});
