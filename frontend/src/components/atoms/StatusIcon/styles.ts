'use client';

import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

export const IconContainer = styled(motion.div)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  margin: theme.spacing(0.25),
  border: '2px solid transparent',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
    borderColor: theme.palette.secondary.main,
  },
}));
