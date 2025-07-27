'use client';

import { Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { SendRounded as SendIcon, CasinoRounded as DiceIcon } from '@mui/icons-material';
import { MessageBubble } from '@/components/atoms';
import * as S from '../styles';

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

interface ChatGeneralProps {
  messages: Message[];
  loading: boolean;
  messageInput: string;
  setMessageInput: (v: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onRollDice?: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatGeneral = ({
  messages,
  loading,
  messageInput,
  setMessageInput,
  onSendMessage,
  onKeyPress,
  onRollDice,
  messagesEndRef,
}: ChatGeneralProps) => (
  <>
    <S.MessagesArea>
      <AnimatePresence>
        {messages.length === 0 ? (
          <S.EmptyState>
            <Typography variant="h6" sx={{ mb: 1, opacity: 0.7 }}>
              Chat Geral
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              As mensagens da sessão aparecerão aqui. Inicie uma conversa!
            </Typography>
          </S.EmptyState>
        ) : (
          messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MessageBubble {...message} isOwner={index % 2 !== 0} />
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
        placeholder="Digite sua mensagem..."
        value={messageInput}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessageInput(e.target.value)}
        onKeyPress={onKeyPress}
        disabled={loading}
        size="small"
      />

      {onRollDice && (
        <S.ActionButton onClick={onRollDice} disabled={loading} title="Rolar dado (1d20)">
          <DiceIcon fontSize="small" />
        </S.ActionButton>
      )}

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
