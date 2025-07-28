'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChatTabs } from '@/components/molecules';
import * as S from './styles';
import { ChatGeneral } from './ChatGeneral';
import { ChatAI } from './ChatAI';
import { ChatNotes } from './Notes';
import { useWebSocket, ChatMessage } from '@/hooks/useWebSocket';
import { useSnackbar } from 'notistack';
import { ConnectionStatus } from '@/components/atoms';
import { Box } from '@mui/material';

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  sessionId: string;
  currentUserId: string;
  isMaster?: boolean;
  onRollDice?: (expression?: string) => void;
  loading?: boolean;
  notes?: Note[];
}

export const ChatPanel = (props: ChatPanelProps) => {
  const { sessionId, currentUserId, isMaster = false, onRollDice, loading = false, notes = [] } = props;
  const { enqueueSnackbar } = useSnackbar();

  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'notes'>('general');
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [editingNote] = useState<string | null>(null);

  // WebSocket integration
  const {
    messages,
    typingUsers,
    isLoadingMessages,
    loadMoreMessages,
    sendMessage,
    startTyping,
    stopTyping,
    isAuthenticated,
    isConnected
  } = useWebSocket({
    sessionId,
    onConnectionChange: (connected) => {
      if (connected) {
        enqueueSnackbar('Conectado ao chat', { variant: 'success' });
      } else {
        enqueueSnackbar('Desconectado do chat', { variant: 'warning' });
      }
    },
    onError: (error) => {
      enqueueSnackbar(`Erro no chat: ${error}`, { variant: 'error' });
    }
  });

  const currentChatType = activeTab === 'ai' ? 'master' : 'general';
  const filteredMessages = messages.filter((m) => m.chat_type === currentChatType);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages]);

  const handleSendMessage = useCallback(() => {
    if (!messageInput.trim() || loading || !isAuthenticated) return;
    
    sendMessage(messageInput.trim(), currentChatType);
    setMessageInput('');
    stopTyping();
  }, [messageInput, loading, isAuthenticated, sendMessage, currentChatType, stopTyping]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = useCallback((value: string) => {
    setMessageInput(value);
    
    if (value.trim() && isAuthenticated) {
      startTyping();
    } else {
      stopTyping();
    }
  }, [isAuthenticated, startTyping, stopTyping]);

  const handleRollDice = useCallback(() => {
    if (onRollDice) {
      onRollDice('1d20');
    } else {
      // Enviar como mensagem padrão
      sendMessage('🎲 Rolou 1d20: ' + Math.floor(Math.random() * 20 + 1), currentChatType);
    }
  }, [onRollDice, sendMessage, currentChatType]);

  const formatNoteDate = (date: Date) =>
    date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

  // Converter ChatMessage para o formato esperado pelos componentes
  const convertMessagesToOldFormat = (messages: ChatMessage[]) => {
    console.log('messages', messages);
    return messages.map(msg => ({
      id: msg.id,
      senderId: msg.sender?.id,
      senderName: msg.sender?.name,
      content: msg.content,
      timestamp: new Date(msg.timestamp),
      type: msg.type,
      chatType: msg.chat_type,
      senderRole: msg.senderRole,
      avatar: msg.sender?.avatar,
    }));
  };

  const convertedMessages = convertMessagesToOldFormat(filteredMessages);

    return (
    <S.ChatContainer elevation={0}>
      {/* Debug: Status da conexão */}
      <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
        <ConnectionStatus 
          isConnected={isConnected}
          isAuthenticated={isAuthenticated}
        />
      </Box>
      
      <ChatTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        isMaster={isMaster}
      >
        {activeTab === 'general' && (
          <ChatGeneral
            messages={convertedMessages}
            loading={loading || !isAuthenticated}
            isLoadingMessages={isLoadingMessages}
            onLoadMoreMessages={() => loadMoreMessages('general')}
            messageInput={messageInput}
            setMessageInput={handleInputChange}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
            onRollDice={isMaster ? undefined : handleRollDice}
            messagesEndRef={messagesEndRef}
            typingUsers={typingUsers}
            currentUserId={currentUserId}
          />
        )}

        {activeTab === 'ai' && isMaster && (
          <ChatAI
            messages={convertedMessages}
            loading={loading || !isAuthenticated}
            isLoadingMessages={isLoadingMessages}
            onLoadMoreMessages={() => loadMoreMessages('master')}
            messageInput={messageInput}
            setMessageInput={handleInputChange}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
            messagesEndRef={messagesEndRef}
            typingUsers={typingUsers}
            currentUserId={currentUserId}
          />
        )}

        {activeTab === 'notes' && (
          <ChatNotes
            notes={notes}
            noteTitle={noteTitle}
            noteContent={noteContent}
            editingNote={editingNote}
            setNoteTitle={setNoteTitle}
            setNoteContent={setNoteContent}
            handleAddNote={() => console.log('add note')}
            handleEditNote={(n: unknown) => console.log(n)}
            handleDeleteNote={(id: string) => console.log(id)}
            handleCancelEdit={() => console.log('cancel edit')}
            formatNoteDate={formatNoteDate}
          />
        )}
      </ChatTabs>
    </S.ChatContainer>
  );
};
