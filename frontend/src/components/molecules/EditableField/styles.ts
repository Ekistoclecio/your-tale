import { Box, IconButton, styled, alpha } from '@mui/material';

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
