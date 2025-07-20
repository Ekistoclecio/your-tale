import { Paper, Box, TextField, styled, alpha } from '@mui/material';

export const Card = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'bordercolor',
})<{ bordercolor: string }>(({ theme, bordercolor }) => ({
  padding: theme.spacing(2),
  border: `2px solid ${bordercolor}`,
  borderRadius: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: alpha(theme.palette.background.default, 0.6),
  boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.2)}`,
}));

export const TopBar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bgcolor',
})<{ bgcolor: string }>(({ bgcolor }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: 4,
  backgroundColor: bgcolor,
}));

export const Header = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(2),
}));

export const ValueInput = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiInputBase-input': {
    textAlign: 'center',
  },
}));

export const ModifierBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bgcolor',
})<{ bgcolor: string }>(({ theme, bgcolor }) => ({
  backgroundColor: alpha(bgcolor, 0.2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  textAlign: 'center',
}));
