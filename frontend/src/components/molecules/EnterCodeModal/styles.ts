import { Box, Modal, Stack, TextField, styled, alpha } from '@mui/material';
import { MotionButton } from '../../atoms/MotionButton';

export const ModalContainer = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
}));

export const Header = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

export const CenteredTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiInputBase-input': {
    textAlign: 'center',
  },
}));

export const Actions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'center',
}));

export const CancelButton = styled(MotionButton)(({ theme }) => ({
  borderColor: theme.palette.text.secondary,
  color: theme.palette.text.secondary,
  '&:hover': {
    borderColor: theme.palette.text.primary,
    color: theme.palette.text.primary,
  },
}));

export const SubmitButton = styled(MotionButton)(({ theme }) => ({
  color: theme.palette.secondary.contrastText,
  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
  },
  '&:disabled': {
    background: alpha(theme.palette.secondary.main, 0.3),
    color: theme.palette.text.disabled,
  },
}));
