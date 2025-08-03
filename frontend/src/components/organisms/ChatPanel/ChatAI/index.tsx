'use client';

import { Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { SendRounded as SendIcon } from '@mui/icons-material';
import { MessageBubble } from '@/components/atoms';
import * as S from '../styles';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'user' | 'ai' | 'system';
  chatType: 'general' | 'ai' | 'master';
  senderRole?: 'player' | 'master';
  avatar?: string;
}

interface ChatAIProps {
  messages: Message[];
  loading: boolean;
  isLoadingMessages?: boolean;
  messageInput: string;
  setMessageInput: (v: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  currentUserId?: string;
}

export const ChatAI = ({
  messages,
  loading,
  messageInput,
  setMessageInput,
  onSendMessage,
  onKeyPress,
  messagesEndRef,
  currentUserId,
}: ChatAIProps) => (
  <>
    <S.MessagesArea id="chat-ai-messages">
      <AnimatePresence>
        {messages.length === 0 ? (
          <S.EmptyState>
            <Typography variant="h6" sx={{ mb: 1, opacity: 0.7 }}>
              Chat com IA
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              Converse com a IA para obter ajuda na sessão. Apenas o mestre pode usar este chat.
            </Typography>
          </S.EmptyState>
        ) : (
          messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MessageBubble {...message} isOwner={message.senderId === currentUserId} />
            </motion.div>
          ))
        )}
      </AnimatePresence>

      <div ref={messagesEndRef} />
    </S.MessagesArea>

    <S.MessageInput>
      <S.StyledTextField
        multiline
        maxRows={3}
        placeholder="Fale com a IA assistente..."
        value={messageInput}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessageInput(e.target.value)}
        onKeyPress={onKeyPress}
        disabled={loading}
        size="small"
      />

      <S.ActionButton
        onClick={onSendMessage}
        disabled={!messageInput.trim() || loading}
        title="Enviar mensagem"
      >
        <SendIcon fontSize="small" />
      </S.ActionButton>
    </S.MessageInput>
  </>
);
