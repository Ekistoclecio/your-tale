import { Components } from '@mui/material';
import { baseTheme } from '@/theme/base';

export const MenuItemOverrides: Components['MuiMenuItem'] = {
  styleOverrides: {
    root: {
      fontFamily: 'var(--font-cinzel)',
      fontWeight: 600,
      color: baseTheme.palette.text.primary,
      '&:hover': {
        backgroundColor: baseTheme.palette.action.hover,
        color: baseTheme.palette.primary.main,
      },
    },
  },
};
