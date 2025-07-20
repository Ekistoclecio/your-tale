import { Components } from '@mui/material/styles';
import { palette } from '@/theme/base/palette';

export const SelectOverrides: Components['MuiSelect'] = {
  defaultProps: {
    MenuProps: {
      PaperProps: {
        sx: {
          backgroundColor: palette.background?.default,
          '& .MuiMenuItem-root': {
            backgroundColor: palette.background?.default,
            color: palette.text?.primary,
            '&:hover': {
              backgroundColor: palette.action?.hover,
              color: palette.primary?.main,
            },
          },
        },
      },
    },
  },
};
