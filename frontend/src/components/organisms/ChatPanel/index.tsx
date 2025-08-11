'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ChatTabs } from '@/components/molecules';
import * as S from './styles';
import { ChatGeneral } from './ChatGeneral';
import { ChatAI } from './ChatAI';
import { ChatNotes } from './Notes';
import { useWebSocket, ChatMessage } from '@/hooks/useWebSocket';
import { useSnackbar } from 'notistack';
import { ConnectionStatus } from '@/components/atoms';
import { Box } from '@mui/material';
import { Note } from '@/schemas/entities/notes';

// Debounce simples para scroll
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDebouncedScroll = (ref: React.RefObject<HTMLDivElement | null>, deps: any[]) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timeout);
  }, deps);
};

interface ChatPanelProps {
  sessionId: string;
  currentUserId: string;
  isMaster?: boolean;
  loading?: boolean;
  notes?: Note[];
  onUpdateNotes: (notes: Note[]) => void;
  isAIMaster?: boolean;
}

export const ChatPanel = ({
  sessionId,
  currentUserId,
  isMaster = false,
  loading = false,
  notes = [],
  onUpdateNotes,
  isAIMaster = false,
}: ChatPanelProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'notes'>('general');
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // ✅ WebSocket callbacks memoizados
  const handleConnectionChange = useCallback(
    (connected: boolean) => {
      enqueueSnackbar(connected ? 'Conectado ao chat' : 'Desconectado do chat', {
        variant: connected ? 'success' : 'warning',
      });
    },
    [enqueueSnackbar]
  );

  const handleError = useCallback(
    (error: string) => {
      enqueueSnackbar(`Erro no chat: ${error}`, { variant: 'error' });
    },
    [enqueueSnackbar]
  );

  // ✅ Hook WebSocket otimizado
  const { messages, isLoadingMessages, sendMessage, isAuthenticated, isConnected } = useWebSocket({
    sessionId,
    onConnectionChange: handleConnectionChange,
    onError: handleError,
  });

  // ✅ Determina tipo de chat ativo
  const currentChatType = useMemo(() => (activeTab === 'ai' ? 'master' : 'general'), [activeTab]);

  // ✅ Filtra mensagens apenas quando necessário
  const filteredMessages = useMemo(
    () => messages.filter((m) => m.chat_type === currentChatType),
    [messages, currentChatType]
  );

  // ✅ Conversão de mensagens memoizada
  const convertMessagesToOldFormat = useCallback(
    (msgs: ChatMessage[]) =>
      msgs.map((msg) => ({
        id: msg.id,
        senderId: msg.sender?.id,
        senderName: msg.sender?.name,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        type: msg.type,
        chatType: msg.chat_type,
        senderRole: msg.senderRole,
        avatar: msg.sender?.avatar,
      })),
    []
  );

  const convertedMessages = useMemo(
    () => convertMessagesToOldFormat(filteredMessages),
    [filteredMessages, convertMessagesToOldFormat]
  );

  // ✅ Scroll debounced
  useDebouncedScroll(messagesEndRef, [filteredMessages]);

  // ✅ Handlers memoizados
  const handleSendMessage = useCallback(() => {
    if (!messageInput.trim() || loading || !isAuthenticated) return;
    sendMessage(messageInput.trim(), currentChatType);
    setMessageInput('');
  }, [messageInput, loading, isAuthenticated, sendMessage, currentChatType]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleInputChange = useCallback((value: string) => {
    setMessageInput(value);
  }, []);

  // const handleRollDice = useCallback(() => {
  //   if (onRollDice) {
  //     onRollDice('1d20');
  //   } else {
  //     sendMessage(`🎲 Rolou 1d20: ${Math.floor(Math.random() * 20 + 1)}`, currentChatType);
  //   }
  // }, [onRollDice, sendMessage, currentChatType]);

  return (
    <S.ChatContainer elevation={0}>
      {/* Status de conexão */}
      <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
        <ConnectionStatus isConnected={isConnected} isAuthenticated={isAuthenticated} />
      </Box>

      <ChatTabs activeTab={activeTab} onTabChange={setActiveTab} isMaster={isMaster}>
        {/* Chat Geral */}
        {activeTab === 'general' && (
          <ChatGeneral
            messages={convertedMessages}
            loading={loading || !isAuthenticated}
            isLoadingMessages={isLoadingMessages}
            messageInput={messageInput}
            setMessageInput={handleInputChange}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
            onRollDice={undefined}
            messagesEndRef={messagesEndRef}
            currentUserId={currentUserId}
            isAIMaster={isAIMaster}
          />
        )}

        {/* Chat AI (somente para mestres) */}
        {activeTab === 'ai' && isMaster && (
          <ChatAI
            currentUserId={currentUserId}
            sessionId={sessionId}
            messagesEndRef={messagesEndRef}
          />
        )}

        {/* Notas */}
        {activeTab === 'notes' && <ChatNotes notes={notes} onUpdateNotes={onUpdateNotes} />}
      </ChatTabs>
    </S.ChatContainer>
  );
};
