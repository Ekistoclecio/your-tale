import { Components } from '@mui/material';
import { baseTheme } from '@/theme/base';

export const FormHelperTextOverrides: Components['MuiFormHelperText'] = {
  styleOverrides: {
    root: {
      color: baseTheme.palette.text.primary,
      '&.Mui-error': {
        color: baseTheme.palette.warning.main,
      },
    },
  },
};
