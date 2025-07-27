'use client';

import { Box, Modal, Stack, styled, Typography } from '@mui/material';
import { MotionButton, MotionCard } from '@/components/atoms';

export const ModalContainer = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
}));

export const Card = styled(MotionCard)(() => ({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '500px',
  width: '95%',
}));

export const Header = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

export const Description = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.text.secondary,
}));

export const CodeContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  backgroundColor: `${theme.palette.primary.main}10`,
  border: `2px solid ${theme.palette.secondary.main}60`,
  borderRadius: theme.shape.borderRadiusMedium,
  marginBottom: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`,
  },
}));

export const CodeLabel = styled(Typography)(({ theme }) => ({
  display: 'block',
  marginBottom: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

export const CodeText = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  letterSpacing: '0.2em',
  color: theme.palette.secondary.main,
  textAlign: 'center',
  fontFamily: 'monospace',
  textShadow: `0 2px 4px ${theme.palette.common.black}40`,
}));

export const InfoBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: `${theme.palette.info.dark}40`,
  border: `1px solid ${theme.palette.info.light}80`,
  borderRadius: theme.shape.borderRadiusSmall,
  marginTop: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

export const CloseButton = styled(MotionButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadiusMedium,
  alignSelf: 'flex-end',
  marginTop: theme.spacing(2),
}));
