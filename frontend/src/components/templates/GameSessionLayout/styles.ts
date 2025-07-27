import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material';
import { motion } from 'framer-motion';

export const LayoutContainer = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 64px)',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
}));

export const ContentArea = styled(Container)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  maxWidth: '100% !important',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const MainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  flex: 1,
  height: 'calc(100vh - 140px)', // Altura ajustada pelo header + barra da sessão
  [theme.breakpoints.down('lg')]: {
    flexDirection: 'column',
    height: 'auto',
    minHeight: '60vh',
  },
}));

export const LeftPanel = styled(Box)(({ theme }) => ({
  width: '300px',
  flexShrink: 0,
  [theme.breakpoints.down('lg')]: {
    width: '100%',
    order: 3,
  },
}));

export const CenterPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  [theme.breakpoints.down('lg')]: {
    order: 1,
  },
}));

export const RightPanel = styled(Box)(({ theme }) => ({
  width: '350px',
  flexShrink: 0,
  [theme.breakpoints.down('lg')]: {
    width: '100%',
    order: 2,
  },
}));

export const MobileChatOverlay = styled(motion.div)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: `${theme.palette.background.default}95`,
  backdropFilter: 'blur(10px)',
  zIndex: 1000,
  display: 'none',
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'column',
  },
}));
