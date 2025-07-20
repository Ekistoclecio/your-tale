import { Components } from '@mui/material';
import { baseTheme } from '@/theme/base';

export const FormLabelOverrides: Components['MuiFormLabel'] = {
  styleOverrides: {
    root: {
      color: baseTheme.palette.text.secondary,
      fontWeight: baseTheme.typography.fontWeightMedium,
      letterSpacing: '0.03em',
      transition: 'color 0.3s ease',

      '&.Mui-focused': {
        color: baseTheme.palette.secondary.main,
      },
      '&.Mui-disabled': {
        color: baseTheme.palette.text.disabled,
      },
      '&.Mui-error': {
        color: baseTheme.palette.error.main,
      },
    },
  },
};
