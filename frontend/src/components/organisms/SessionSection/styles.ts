import { Box, Typography, Pagination as MuiPagination, styled, alpha } from '@mui/material';
import { motion } from 'framer-motion';

// styles.ts
export const Container = styled(motion.div)(({ theme }) => ({
  border: '2px solid',
  borderRadius: 16,
  padding: theme.spacing(4),
  height: '800px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  background: `
    linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.3)} 0%, ${alpha(
      theme.palette.secondary.main,
      0.2
    )} 100%)
  `,
  boxShadow: `0 2px 16px ${alpha(theme.palette.secondary.main, 0.1)}`,
  transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
  outline: 'none',
}));

export const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontFamily: 'var(--font-pirata-one)',
  textAlign: 'center',
  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  flexShrink: 0,
  position: 'relative',
  zIndex: 1,
}));

export const List = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  overflowY: 'auto',
  paddingRight: theme.spacing(1),
  position: 'relative',
  zIndex: 1,
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: alpha(theme.palette.secondary.main, 0.05),
    borderRadius: 4,
  },
  '&::-webkit-scrollbar-thumb': {
    background: alpha(theme.palette.secondary.main, 0.3),
    borderRadius: 4,
    '&:hover': {
      background: alpha(theme.palette.secondary.main, 0.5),
    },
  },
}));

export const PaginationWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(4),
  flexShrink: 0,
  position: 'relative',
  zIndex: 1,
}));

export const Pagination = styled(MuiPagination)(({ theme }) => ({
  marginTop: theme.spacing(4),
  flexShrink: 0,
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  justifyContent: 'center',
  '& .MuiPaginationItem-root': {
    color: theme.palette.text.secondary,
    fontFamily: 'var(--font-cinzel)',
    fontWeight: 600,
    '&.Mui-selected': {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
    },
  },
}));
