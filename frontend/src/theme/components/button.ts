import { Components } from '@mui/material';
import { baseTheme } from '@/theme/base';

export const ButtonOverrides: Components['MuiButton'] = {
  styleOverrides: {
    root: {
      borderRadius: baseTheme.shape.borderRadius,
      padding: '12px 24px',
      transition: 'all 0.3s ease-in-out',
      color: baseTheme.palette.primary?.contrastText,
    },
    contained: {
      backgroundColor: baseTheme.palette.primary?.main,
      '&:hover': {
        transform: 'scale(1.02)',
        backgroundColor: baseTheme.palette.primary?.dark,
        boxShadow: `0 0 12px 2px ${baseTheme.palette.secondary?.main || '#E6A74A'}`,
      },
    },
  },
};
