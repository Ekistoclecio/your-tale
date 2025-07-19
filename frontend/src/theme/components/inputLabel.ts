import { Components } from '@mui/material';
import { baseTheme } from '@/theme/base';

export const InputLabelOverrides: Components['MuiInputLabel'] = {
  styleOverrides: {
    root: {
      color: baseTheme.palette.text?.secondary,
      fontWeight: baseTheme.typography.fontWeightMedium,
      letterSpacing: '0.03em',

      '&.Mui-focused': {
        color: baseTheme.palette.secondary?.main,
      },
    },
    shrink: {
      color: baseTheme.palette.secondary?.main,
    },
  },
};
