import { Box, Card as MuiCard } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Variants } from 'framer-motion';

export const Root = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  position: 'relative',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: theme.spacing(8),

  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(24),
  },
}));

export const Card = styled(MuiCard)(({ theme }) => ({
  width: '100%',
  minWidth: 400,
  maxWidth: 550,

  [theme.breakpoints.up('sm')]: {
    maxWidth: 550,
  },
}));

//--------------------------------
// Animações
export const motionCardVariant: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      type: 'spring',
      stiffness: 100,
    },
  },
};
