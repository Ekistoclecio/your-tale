import { baseTheme } from '@/theme/base';
import { Components } from '@mui/material';
import NextLink from 'next/link';

export const LinkOverrides: Components['MuiLink'] = {
  defaultProps: {
    component: NextLink,
  },
  styleOverrides: {
    root: {
      textDecoration: 'none',
      color: baseTheme.palette.primary?.main,
      '&:hover': {
        color: baseTheme.palette.secondary?.light,
      },
    },
  },
};
