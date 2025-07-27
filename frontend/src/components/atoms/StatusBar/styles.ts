'use client';

import { Box, styled } from '@mui/material';
import { motion } from 'framer-motion';

export const BarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: theme.spacing(0.5),
}));

export const BarTrack = styled(Box)(() => ({
  borderRadius: 4,
  overflow: 'hidden',
  position: 'relative',
}));

export const BarFill = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== 'fillColor' && prop !== 'barHeight',
})<{ fillColor: string; barHeight: number }>(({ fillColor, barHeight }) => ({
  height: barHeight,
  backgroundColor: fillColor,
  borderRadius: 4,
  transition: 'width 0.3s ease-in-out',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(90deg, transparent 0%, ${fillColor}40 50%, transparent 100%)`,
    animation: 'shimmer 2s infinite',
  },
  '@keyframes shimmer': {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' },
  },
}));

export const LabelContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});
