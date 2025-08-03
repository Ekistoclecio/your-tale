'use client';

import { Box, Chip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Wifi as ConnectedIcon,
  WifiOff as DisconnectedIcon,
  Error as ErrorIcon,
  Sync as ReconnectingIcon,
} from '@mui/icons-material';

const StatusContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadiusSmall,
  backgroundColor: `${theme.palette.background.paper}20`,
  border: `1px solid ${theme.palette.divider}`,
}));

interface ConnectionStatusProps {
  isConnected: boolean;
  isAuthenticated: boolean;
  error?: string;
  isReconnecting?: boolean;
}

export const ConnectionStatus = ({
  isConnected,
  isAuthenticated,
  error,
  isReconnecting = false,
}: ConnectionStatusProps) => {
  // Função para determinar a cor do status (pode ser usada no futuro)
  // const getStatusColor = () => {
  //   if (error) return 'error';
  //   if (isReconnecting) return 'warning';
  //   if (isConnected && isAuthenticated) return 'success';
  //   if (isConnected && !isAuthenticated) return 'info';
  //   return 'default';
  // };

  const getStatusText = () => {
    if (error) return 'Erro de conexão com o chat';
    if (isReconnecting) return 'Reconectando ao chat...';
    if (isConnected && isAuthenticated) return 'Conectado ao chat';
    if (isConnected && !isAuthenticated) return 'Conectando ao chat...';
    return 'Desconectado do chat';
  };

  const getStatusIcon = () => {
    if (error) return <ErrorIcon fontSize="small" />;
    if (isReconnecting) return <ReconnectingIcon fontSize="small" />;
    if (isConnected) return <ConnectedIcon fontSize="small" />;
    return <DisconnectedIcon fontSize="small" />;
  };

  return (
    <StatusContainer>
      {getStatusIcon()}
      <Typography variant="caption" color="text.secondary">
        {getStatusText()}
      </Typography>
      <Chip
        label={isAuthenticated ? 'Autenticado' : 'Não Autenticado'}
        size="small"
        color={isAuthenticated ? 'success' : 'default'}
        variant="outlined"
      />
      {error && (
        <Typography variant="caption" color="error" sx={{ ml: 1 }}>
          {error}
        </Typography>
      )}
    </StatusContainer>
  );
};
