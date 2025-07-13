import { Components } from '@mui/material';

export const TextFieldOverrides: Components['MuiTextField'] = {
  defaultProps: {
    variant: 'outlined',
    fullWidth: true,
  },
};
