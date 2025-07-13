import { Components } from '@mui/material';
import { baseTheme } from '@/theme/base';

export const InputLabelOverrides: Components['MuiInputLabel'] = {
  styleOverrides: {
    root: {
      color: baseTheme.palette.text?.primary,
      fontWeight: baseTheme.typography.fontWeightMedium,
      letterSpacing: '0.03em',
    },
    shrink: {
      color: baseTheme.palette.secondary?.main,
      ...baseTheme.typography.h5,
    },
  },
};
