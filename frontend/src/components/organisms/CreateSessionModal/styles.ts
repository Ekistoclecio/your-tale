import { Dialog, Stack, Box, styled, alpha, Typography, MenuItem, Button } from '@mui/material';
import { MotionButton } from '../../atoms/MotionButton';

export const ModalContainer = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(2),
    background: 'linear-gradient(135deg, #1A141F 0%, #2B1F33 100%)',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    width: '900px',
    maxWidth: '95%',
    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
    padding: theme.spacing(1),

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
  },
}));

export const ModalContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  minWidth: 600,
  [theme.breakpoints.down('md')]: {
    minWidth: 'auto',
    padding: theme.spacing(2),
  },
}));

export const Header = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(4),
  marginBottom: 16,
}));

export const ContentContainer = styled(Stack)(() => ({
  width: '100%',
}));

export const ContentColumn = styled(Box)(() => ({
  flex: 1,
  minWidth: 0,
}));

export const Section = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(6),
  borderRadius: theme.spacing(1),
  background: '#2F2138',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  '&:last-child': {
    marginBottom: 0,
  },
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  margin: 0,
  color: theme.palette.secondary.main,
}));

export const CancelButton = styled(MotionButton)(({ theme }) => ({
  borderColor: theme.palette.text.secondary,
  color: theme.palette.text.secondary,
  '&:hover': {
    borderColor: theme.palette.text.primary,
    color: theme.palette.text.primary,
  },
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.contrastText,
  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
    transform: 'scale(1.02)',
    transition: 'transform 0.2s ease-in-out',
  },
  '&:disabled': {
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%) !important`,
    color: `${theme.palette.text.disabled} !important`,
  },
}));

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.primary.main,
  },
}));
