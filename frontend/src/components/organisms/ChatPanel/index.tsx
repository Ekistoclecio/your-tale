'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatTabs } from '@/components/molecules';
import * as S from './styles';
import { ChatGeneral } from './ChatGeneral';
import { ChatAI } from './ChatAI';
import { ChatNotes } from './Notes';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'user' | 'ai' | 'system';
  chatType: 'general' | 'ai';
  senderRole?: 'player' | 'master';
  avatar?: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  messages: Message[];
  isMaster?: boolean;
  onSendMessage: (message: string, chatType: 'general' | 'ai') => void;
  onRollDice: () => void;
  loading?: boolean;
  notes: Note[];
}

export const ChatPanel = (props: ChatPanelProps) => {
  const { messages, isMaster = false, onSendMessage, onRollDice, loading = false, notes } = props;

  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'notes'>('general');
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editingNote, setEditingNote] = useState<string | null>(null);

  const currentChatType = activeTab === 'ai' ? 'ai' : 'general';
  const filteredMessages = messages.filter((m) => m.chatType === currentChatType);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || loading) return;
    onSendMessage(messageInput.trim(), currentChatType);
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatNoteDate = (date: Date) =>
    date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <S.ChatContainer elevation={0}>
      <ChatTabs activeTab={activeTab} onTabChange={setActiveTab} isMaster={isMaster}>
        {activeTab === 'general' && (
          <ChatGeneral
            messages={filteredMessages}
            loading={loading}
            messageInput={messageInput}
            setMessageInput={setMessageInput}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
            onRollDice={onRollDice}
            messagesEndRef={messagesEndRef}
          />
        )}

        {activeTab === 'ai' && (
          <ChatAI
            messages={filteredMessages}
            loading={loading}
            messageInput={messageInput}
            setMessageInput={setMessageInput}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
            messagesEndRef={messagesEndRef}
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
