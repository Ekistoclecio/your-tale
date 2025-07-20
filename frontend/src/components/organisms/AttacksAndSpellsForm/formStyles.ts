import { Box, Card, Typography, styled, alpha } from '@mui/material';

export const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(4),
  backgroundColor: theme.palette.primary.light,
  border: `1px solid ${alpha(theme.palette.secondary.main, 0.6)}`,
  boxShadow: `
    0 2px 6px ${alpha(theme.palette.secondary.main, 0.15)},
    0 4px 12px ${alpha(theme.palette.secondary.light, 0.05)}
  `,
}));

export const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(6),
}));

export const HeaderTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h5,
  fontWeight: 'bold',
  color: theme.palette.secondary.light,
}));

export const ActionsBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: 'flex',
  gap: theme.spacing(1),
}));
