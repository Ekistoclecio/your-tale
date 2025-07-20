import { Components } from '@mui/material';
import { baseTheme } from '@/theme/base';

export const IconButtonOverrides: Components['MuiIconButton'] = {
  styleOverrides: {
    root: {
      backgroundColor: baseTheme.palette.primary?.main,
      color: baseTheme.palette.primary?.contrastText,
      padding: baseTheme.spacing(2),
      width: 'fit-content',
      height: 'fit-content',
      transition: 'all 0.3s ease-in-out',

      '&:hover': {
        transform: 'scale(1.02)',
        backgroundColor: baseTheme.palette.primary?.dark,
        boxShadow: baseTheme.shadowsCustom.glow(baseTheme.palette.secondary?.main),
      },

      '&:disabled': {
        backgroundColor: baseTheme.palette.action?.disabledBackground,
        color: baseTheme.palette.action?.disabled,
        boxShadow: 'none',
      },
    },
  },
};
