'use client';

import { Avatar, useTheme } from '@mui/material';
import {
  Person as PersonIcon,
  SmartToy as AIIcon,
  Settings as SystemIcon,
  Shield as MasterIcon,
} from '@mui/icons-material';
import * as S from './styles';

interface MessageBubbleProps {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'user' | 'ai' | 'system';
  senderRole?: 'player' | 'master';
  avatar?: string;
  isOwner?: boolean;
}

export const MessageBubble = ({
  senderName,
  content,
  timestamp,
  type,
  senderRole = 'player',
  avatar,
  isOwner = false,
}: MessageBubbleProps) => {
  const theme = useTheme();

  const getMessageType = () => {
    if (type === 'system') return 'system';
    if (type === 'ai') return 'ai';
    if (senderRole === 'master') return 'master';
    return 'player';
  };

  const getAvatarIcon = () => {
    const messageType = getMessageType();
    const color = theme.palette.text.secondary;

    switch (messageType) {
      case 'master':
        return <MasterIcon sx={{ color }} />;
      case 'ai':
        return <AIIcon sx={{ color }} />;
      case 'system':
        return <SystemIcon sx={{ color }} />;
      default:
        return <PersonIcon sx={{ color }} />;
    }
  };

  const formatTimestamp = () =>
    timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const messageType = getMessageType();

  return (
    <S.MessageContainer
      isOwnMessage={isOwner}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Avatar
        src={avatar}
        alt={senderName}
        sx={{
          width: 32,
          height: 32,
          bgcolor: theme.palette.secondary.dark,
        }}
      >
        {!avatar && getAvatarIcon()}
      </Avatar>

      <S.BubbleContent messageType={messageType} isOwnMessage={isOwner}>
        <S.MessageHeader>
          <S.SenderName variant="caption" messageType={messageType}>
            {senderName}
          </S.SenderName>
          <S.Timestamp variant="caption">{formatTimestamp()}</S.Timestamp>
        </S.MessageHeader>

        <S.MessageText variant="body2" messageType={messageType}>
          {content}
        </S.MessageText>
      </S.BubbleContent>
    </S.MessageContainer>
  );
};
