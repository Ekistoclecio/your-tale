import { Components } from '@mui/material';
import { baseTheme } from '@/theme/base';

export const OutlinedInputOverrides: Components['MuiOutlinedInput'] = {
  styleOverrides: {
    root: {
      borderRadius: baseTheme.shape.borderRadius,
      backgroundColor: baseTheme.palette.background?.input,
      color: baseTheme.palette.text?.primary,

      '& fieldset': {
        borderColor: baseTheme.palette.primary?.main,
      },
      '&:hover fieldset': {
        borderColor: baseTheme.palette.primary?.light,
      },
      '&.Mui-focused fieldset': {
        borderColor: baseTheme.palette.secondary?.main,
      },
      '& input': {
        color: baseTheme.palette.text?.primary,
      },
    },
  },
};
