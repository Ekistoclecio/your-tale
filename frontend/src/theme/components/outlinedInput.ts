import { Components } from '@mui/material';
import { baseTheme } from '@/theme/base';

export const OutlinedInputOverrides: Components['MuiOutlinedInput'] = {
  styleOverrides: {
    root: {
      borderRadius: baseTheme.shape.borderRadius,
      backgroundColor: baseTheme.palette.background?.input,
      color: baseTheme.palette.text?.primary,

      '& fieldset': {
        borderColor: `${baseTheme.palette.primary?.main} !important`,
      },
      '&:hover fieldset': {
        borderColor: `${baseTheme.palette.primary?.light} !important`,
      },
      '&.Mui-focused fieldset': {
        borderColor: `${baseTheme.palette.secondary?.main} !important`,
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: `${baseTheme.palette.primary.light} !important`,
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: `${baseTheme.palette.secondary.main} !important`,
      },
      '& input': {
        color: baseTheme.palette.text?.primary,
      },
    },
    notchedOutline: {
      borderColor: `${baseTheme.palette.primary.main} !important`,
    },
  },
};
