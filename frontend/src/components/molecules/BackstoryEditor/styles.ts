import { Box, Typography, styled } from '@mui/material';

export const Wrapper = styled(Box)(() => ({
  position: 'relative',
}));

export const ControlsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: theme.spacing(1),
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
}));

export const IconButtonWrapper = styled(Box)(() => ({
  display: 'flex',
  gap: 8,
}));

export const CharCount = styled(Typography)(({ theme }) => ({
  ...theme.typography.caption,
}));
