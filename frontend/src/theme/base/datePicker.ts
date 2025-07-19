import { palette } from './palette';

export const datePickerGlobalStyles = {
  '& .MuiPickersLayout-root': {
    backgroundColor: palette.background?.default,

    '& * > button': {
      padding: '8px',
      borderRadius: '8px',
      backgroundColor: palette.background?.default,
      color: palette.text?.primary,
      border: `1px solid ${palette.divider}`,
      '&:hover': {
        backgroundColor: palette.background?.input,
        boxShadow: 'none',
      },
    },
  },
  '& .MuiPickersOutlinedInput-root': {
    '& fieldset': {
      borderColor: `${palette.primary?.main} !important`,
    },
    '&:hover fieldset': {
      borderColor: `${palette.primary?.light} !important`,
    },
    '&.Mui-focused fieldset': {
      borderColor: `${palette.secondary?.main} !important`,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: `${palette.primary?.light} !important`,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: `${palette.secondary?.main} !important`,
    },
    '& input': {
      color: `${palette.text?.primary} !important`,
    },
  },
};
