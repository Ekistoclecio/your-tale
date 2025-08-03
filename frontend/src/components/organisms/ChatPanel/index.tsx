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

// Debounce simples para scroll
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useDebouncedScroll = (ref: React.RefObject<HTMLDivElement | null>, deps: any[]) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timeout);
  }, deps);
};

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

export const ChatPanel = ({
  sessionId,
  currentUserId,
  isMaster = false,
  onRollDice,
  loading = false,
  notes = [],
}: ChatPanelProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'notes'>('general');
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [editingNote, setEditingNote] = useState<string | null>(null);

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

  const handleRollDice = useCallback(() => {
    if (onRollDice) {
      onRollDice('1d20');
    } else {
      sendMessage(`🎲 Rolou 1d20: ${Math.floor(Math.random() * 20 + 1)}`, currentChatType);
    }
  }, [onRollDice, sendMessage, currentChatType]);

  const formatNoteDate = useCallback(
    (date: Date) =>
      date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    []
  );

  // ✅ Handlers de notas (ainda placeholders, mas prontos para lógica futura)
  const handleAddNote = useCallback(() => {
    console.log('add note');
  }, []);

  const handleEditNote = useCallback((note: Note) => {
    setEditingNote(note.id);
    console.log('edit note', note);
  }, []);

  const handleDeleteNote = useCallback((id: string) => {
    console.log('delete note', id);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingNote(null);
    console.log('cancel edit');
  }, []);

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
            onRollDice={isMaster ? undefined : handleRollDice}
            messagesEndRef={messagesEndRef}
            currentUserId={currentUserId}
          />
        )}

        {/* Chat AI (somente para mestres) */}
        {activeTab === 'ai' && isMaster && (
          <ChatAI
            messages={convertedMessages}
            loading={loading || !isAuthenticated}
            isLoadingMessages={isLoadingMessages}
            messageInput={messageInput}
            setMessageInput={handleInputChange}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
            messagesEndRef={messagesEndRef}
            currentUserId={currentUserId}
          />
        )}

        {/* Notas */}
        {activeTab === 'notes' && (
          <ChatNotes
            notes={notes}
            noteTitle={noteTitle}
            noteContent={noteContent}
            editingNote={editingNote}
            setNoteTitle={setNoteTitle}
            setNoteContent={setNoteContent}
            handleAddNote={handleAddNote}
            handleEditNote={handleEditNote}
            handleDeleteNote={handleDeleteNote}
            handleCancelEdit={handleCancelEdit}
            formatNoteDate={formatNoteDate}
          />
        )}
      </ChatTabs>
    </S.ChatContainer>
  );
};
