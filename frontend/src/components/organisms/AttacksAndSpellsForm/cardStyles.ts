import { Box, Card, IconButton, Typography, styled, alpha } from '@mui/material';

export const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.primary.dark,
  border: `1px solid ${alpha(theme.palette.secondary.main, 0.4)}`,
  boxShadow: `
    0 2px 6px ${alpha(theme.palette.secondary.main, 0.15)},
    0 4px 12px ${alpha(theme.palette.secondary.light, 0.05)}
  `,
}));

export const HeaderBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: 8,
}));

export const AttackName = styled(Typography)(({ theme }) => ({
  ...theme.typography.h6,
  fontWeight: 'bold',
  color: theme.palette.text.secondary,
}));

export const StyledIconButton = styled(IconButton)(() => ({
  padding: 4,
}));

export const DetailText = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
}));
