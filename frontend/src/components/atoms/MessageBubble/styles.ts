import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export const MessageContainer = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== 'isOwnMessage',
})<{ isOwnMessage?: boolean }>(({ theme, isOwnMessage }) => ({
  display: 'flex',
  flexDirection: isOwnMessage ? 'row-reverse' : 'row',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
  alignItems: 'flex-start',
  borderRadius: theme.shape.borderRadiusSmall,
  transition: 'background-color 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: `${theme.palette.action.hover}20`,
  },
}));

export const BubbleContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'messageType' && prop !== 'isOwnMessage',
})<{ messageType: string; isOwnMessage?: boolean }>(({ theme, messageType, isOwnMessage }) => {
  let backgroundColor = theme.palette.background.paper;
  let borderColor = theme.palette.divider;

  switch (messageType) {
    case 'master':
      backgroundColor = `${theme.palette.secondary.main}15`;
      borderColor = theme.palette.secondary.main;
      break;
    case 'ai':
      backgroundColor = `${theme.palette.info.main}15`;
      borderColor = theme.palette.info.main;
      break;
    case 'system':
      backgroundColor = `${theme.palette.action.selected}15`;
      borderColor = theme.palette.text.secondary;
      break;
    default:
      backgroundColor = `${theme.palette.primary.main}10`;
      borderColor = theme.palette.primary.light;
  }

  return {
    flex: 1,
    padding: theme.spacing(1.5),
    backgroundColor,
    borderRadius: theme.shape.borderRadiusMedium,
    border: `1px solid ${borderColor}`,
    position: 'relative',
    [isOwnMessage ? 'marginRight' : 'marginLeft']: '4px',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 10,
      [isOwnMessage ? 'right' : 'left']: -8,
      width: 0,
      height: 0,
      borderTop: '6px solid transparent',
      borderBottom: '6px solid transparent',
      [isOwnMessage ? 'borderLeft' : 'borderRight']: `8px solid ${borderColor}`,
    },
  };
});

export const MessageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(0.5),
}));

export const SenderName = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'messageType',
})<{ messageType: string }>(({ theme, messageType }) => {
  let color = theme.palette.text.primary;

  switch (messageType) {
    case 'master':
      color = theme.palette.secondary.main;
      break;
    case 'ai':
      color = theme.palette.info.main;
      break;
    case 'system':
      color = theme.palette.text.secondary;
      break;
  }

  return {
    fontWeight: 600,
    color,
    fontSize: '0.875rem',
  };
});

export const MessageText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'messageType',
})<{ messageType: string }>(({ theme, messageType }) => ({
  color: messageType === 'system' ? theme.palette.text.secondary : theme.palette.text.primary,
  fontStyle: messageType === 'system' ? 'italic' : 'normal',
  lineHeight: 1.5,
  wordBreak: 'break-word',
}));

export const Timestamp = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.disabled,
  fontSize: '0.75rem',
}));
