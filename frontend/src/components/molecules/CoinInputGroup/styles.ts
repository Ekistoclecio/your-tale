import { Box, Typography, styled, alpha } from '@mui/material';

export const Wrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.primary.light,
  border: `1px solid ${alpha(theme.palette.secondary.main, 0.6)}`,
  boxShadow: `
    0 2px 6px ${alpha(theme.palette.secondary.main, 0.15)},
    0 4px 12px ${alpha(theme.palette.secondary.light, 0.05)}
  `,
}));

export const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

export const HeaderTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h6,
  fontWeight: 'bold',
  color: theme.palette.secondary.light,
}));

export const CoinFieldWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
}));

export const CoinIcon = styled(Typography)(({ theme }) => ({
  ...theme.typography.h6,
}));
