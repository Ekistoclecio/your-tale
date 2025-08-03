import { SxProps, Theme } from '@mui/material';

export const container: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100%',
  minWidth: '100%',
  backgroundColor: 'background.default',
  gap: 3,
  padding: 2,
};

export const messageText = {
  textAlign: 'center',
  fontWeight: 500,
  letterSpacing: 0.5,
};

export const dotsContainer: SxProps<Theme> = {
  display: 'flex',
  gap: 0.5,
  marginTop: 1,
};

export const dot: SxProps<Theme> = {
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor: 'secondary.main',
};
