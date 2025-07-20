import { Box, Modal, Stack, IconButton, styled, alpha } from '@mui/material';
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
  marginBottom: theme.spacing(3),
}));

export const AvatarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(4),
}));

export const FieldsContainer = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(3),
  marginBottom: theme.spacing(4),
}));

export const FieldContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
}));

export const ActionButton = styled(IconButton)(({ theme }) => ({
  marginTop: theme.spacing(1),
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  '&.Mui-disabled': {
    color: theme.palette.text.disabled,
  },
}));

export const Actions = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
}));

export const CloseButton = styled(MotionButton)(({ theme }) => ({
  borderColor: theme.palette.text.secondary,
  color: theme.palette.text.secondary,
  '&:hover': {
    borderColor: theme.palette.text.primary,
    color: theme.palette.text.primary,
  },
}));
