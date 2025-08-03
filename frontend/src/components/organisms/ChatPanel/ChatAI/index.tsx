'use client';

import { CircularProgress, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { SendRounded as SendIcon } from '@mui/icons-material';
import { MessageBubble } from '@/components/atoms';
import * as S from '../styles';
import { useSessionAiChatMessagesQuery } from '@/queries/session/queries';
import { useEffect, useState } from 'react';
import { Message } from '@/services/session';
import { useSession } from 'next-auth/react';
import { useSendMessage } from '@/queries/session/mutation';
import { useSnackbar } from 'notistack';
import { useDebouncedScroll } from '..';
interface ChatAIProps {
  sessionId: string;
  currentUserId?: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatAI = ({ sessionId, currentUserId, messagesEndRef }: ChatAIProps) => {
  const { data: session } = useSession();
  const { enqueueSnackbar } = useSnackbar();
  const [messageInput, setMessageInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const { data: messagesData, isLoading } = useSessionAiChatMessagesQuery(sessionId);

  const { mutateAsync: sendMessage } = useSendMessage(sessionId);

  useDebouncedScroll(messagesEndRef, [messages]);

  useEffect(() => {
    if (messagesData) {
      const reversedMessages = messagesData.data.reverse();
      setMessages(reversedMessages);
    }
  }, [messagesData]);

  const handleSendMessage = async () => {
    if (isSendingMessage) return;
    try {
      setIsSendingMessage(true);
      const message = await sendMessage(messageInput);
      const userMessage = {
        id: new Date().getTime().toString(),
        content: messageInput,
        timestamp: new Date().toISOString(),
        type: 'user' as const,
        sender: { id: session?.user?.id || '', name: session?.user?.name || '' },
        sender_id: session?.user?.id || '',
        session_id: sessionId,
        chat_type: 'master' as const,
      };
      setMessages([...messages, userMessage, message]);
      setMessageInput('');
      setIsSendingMessage(false);
    } catch {
      enqueueSnackbar('Erro ao enviar mensagem', { variant: 'error' });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) return null;

  return (
    <>
      <S.MessagesArea id="chat-ai-messages">
        <AnimatePresence>
          {messages?.length === 0 ? (
            <S.EmptyState>
              <Typography variant="h6" sx={{ mb: 1, opacity: 0.7 }}>
                Chat com IA
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.6 }}>
                Converse com a IA para obter ajuda na sessão. Apenas o mestre pode usar este chat.
              </Typography>
            </S.EmptyState>
          ) : (
            messages?.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <MessageBubble
                  id={message.id}
                  content={message.content}
                  timestamp={new Date(message.timestamp)}
                  type={message.type}
                  senderRole="player"
                  avatar={message.sender?.avatar || ''}
                  isOwner={message.sender?.id === currentUserId}
                  senderId={message.sender?.id || ''}
                  senderName={message.sender?.name || ''}
                />
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
          onKeyPress={handleKeyPress}
          disabled={isLoading || isSendingMessage}
          size="small"
        />

        <S.ActionButton
          onClick={handleSendMessage}
          disabled={!messageInput.trim() || isLoading || isSendingMessage}
          title="Enviar mensagem"
        >
          {isLoading || isSendingMessage ? (
            <CircularProgress size={20} />
          ) : (
            <SendIcon fontSize="small" />
          )}
        </S.ActionButton>
      </S.MessageInput>
    </>
  );
};
