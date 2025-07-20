import { Components } from '@mui/material';
import { baseTheme } from '@/theme/base';

export const AvatarOverrides: Components['MuiAvatar'] = {
  styleOverrides: {
    root: {
      border: '2px solid',
      borderColor: baseTheme.palette.primary.main,
      boxShadow: baseTheme.shadowsCustom?.md(baseTheme.palette.primary.main),
    },
  },
};
