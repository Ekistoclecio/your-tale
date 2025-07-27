import { IconButton, useTheme } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useRef } from 'react';

export const ConfiguredSnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  const notistackRef = useRef<SnackbarProvider | null>(null);
  return (
    <SnackbarProvider
      ref={notistackRef}
      maxSnack={3}
      autoHideDuration={3000}
      style={{
        fontSize: theme.typography.subtitle1.fontSize,
        fontWeight: theme.typography.subtitle1.fontWeight,
        lineHeight: theme.typography.subtitle1.lineHeight,
        fontFamily: theme.typography.subtitle1.fontFamily,
        fontStyle: theme.typography.subtitle1.fontStyle,
      }}
      action={(key) => (
        <IconButton
          onClick={() => notistackRef.current?.closeSnackbar(key)}
          color="inherit"
          size="small"
          sx={{
            mr: '8px',
            padding: '2px',
          }}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      )}
    >
      {children}
    </SnackbarProvider>
  );
};
