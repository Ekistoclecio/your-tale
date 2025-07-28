'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';
import { sessionService, Message as ApiMessage } from '@/services/session';

export interface ChatMessage {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  type: 'user' | 'ai' | 'system';
  chat_type: 'general' | 'master';
  senderRole?: 'player' | 'master';
}

export interface TypingUser {
  id: string;
  name: string;
}

export interface UseWebSocketProps {
  sessionId: string;
  onConnectionChange?: (connected: boolean) => void;
  onError?: (error: string) => void;
}

export interface UseWebSocketReturn {
  socket: Socket | null;
  isAuthenticated: boolean;
  isConnected: boolean;
  messages: ChatMessage[];
  typingUsers: TypingUser[];
  isLoadingMessages: boolean;
  loadMoreMessages: (chatType: 'general' | 'master') => Promise<void>;
  sendMessage: (content: string, chatType: 'general' | 'master') => void;
  startTyping: () => void;
  stopTyping: () => void;
  joinSession: () => void;
  leaveSession: () => void;
  clearMessages: () => void;
}

const SERVER_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001';

export const useWebSocket = ({ 
  sessionId, 
  onConnectionChange, 
  onError 
}: UseWebSocketProps): UseWebSocketReturn => {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const onConnectionChangeRef = useRef(onConnectionChange);
  const onErrorRef = useRef(onError);

  // Atualizar refs quando as props mudarem
  useEffect(() => {
    onConnectionChangeRef.current = onConnectionChange;
    onErrorRef.current = onError;
  }, [onConnectionChange, onError]);

  // Conectar ao WebSocket
  useEffect(() => {
    if (!session?.accessToken || !sessionId) return;

    console.log('🔌 Conectando ao WebSocket...');
    
    const newSocket = io(`${SERVER_URL}/chat`, {
      auth: {
        token: session.accessToken
      },
      transports: ['websocket', 'polling'],
      timeout: 20000, // 20 segundos de timeout
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      autoConnect: true
    });

    // Eventos de conexão
    newSocket.on('connect', () => {
      console.log('✅ Conectado ao servidor WebSocket');
      setIsConnected(true);
      onConnectionChangeRef.current?.(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Desconectado do servidor WebSocket:', reason);
      setIsConnected(false);
      setIsAuthenticated(false);
      onConnectionChangeRef.current?.(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Erro de conexão:', error);
      console.error('❌ Detalhes do erro:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      setIsConnected(false);
      setIsAuthenticated(false);
      onErrorRef.current?.(error.message);
    });

    // Eventos de reconexão
    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconectado após', attemptNumber, 'tentativas');
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Tentativa de reconexão:', attemptNumber);
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('❌ Erro na reconexão:', error);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('❌ Falha na reconexão após todas as tentativas');
    });

    // Evento de autenticação bem-sucedida
    newSocket.on('connected', (data) => {
      console.log('🔐 Autenticado com sucesso:', data);
      setIsAuthenticated(true);
      
      // Entrar na sessão automaticamente
      newSocket.emit('join_session', { sessionId });
    });

    // Eventos de sessão
    newSocket.on('joined_session', (data) => {
      console.log('🎮 Entrou na sessão:', data);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: { id: 'system', name: 'Sistema' },
        content: `Entrou na sessão: ${data.sessionId || sessionId}`,
        timestamp: new Date().toISOString(),
        type: 'system',
        chat_type: 'general'
      }]);
    });

    newSocket.on('left_session', (data) => {
      console.log('🚪 Saiu da sessão:', data);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: { id: 'system', name: 'Sistema' },
        content: 'Saiu da sessão',
        timestamp: new Date().toISOString(),
        type: 'system',
        chat_type: 'general'
      }]);
    });

    // Eventos de usuários
    newSocket.on('user_joined', (data) => {
      console.log('👋 Usuário entrou:', data);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: { id: 'system', name: 'Sistema' },
        content: `${data.user?.name || 'Usuário'} entrou na sessão`,
        timestamp: new Date().toISOString(),
        type: 'system',
        chat_type: 'general'
      }]);
    });

    newSocket.on('user_left', (data) => {
      console.log('👋 Usuário saiu:', data);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: { id: 'system', name: 'Sistema' },
        content: `${data.user?.name || 'Usuário'} saiu da sessão`,
        timestamp: new Date().toISOString(),
        type: 'system',
        chat_type: 'general'
      }]);
    });

    // Eventos de mensagem
    newSocket.on('message_sent', (data) => {
      console.log('📤 Mensagem enviada:', data);
      // Mensagem já foi enviada pelo usuário atual, não adicionar novamente
    });

    newSocket.on('new_message', (message: ChatMessage) => {
      console.log('📨 Nova mensagem:', message);
      setMessages(prev => [...prev, message]);
    });

    // Eventos de digitação
    newSocket.on('user_typing_start', (data) => {
      console.log('⌨️ Usuário digitando:', data);
      if (data.user) {
        setTypingUsers(prev => {
          const userExists = prev.find(user => user.id === data.user.id);
          if (!userExists) {
            return [...prev, { id: data.user.id, name: data.user.name }];
          }
          return prev;
        });
      }
    });

    newSocket.on('user_typing_stop', (data) => {
      console.log('⌨️ Usuário parou de digitar:', data);
      if (data.user) {
        setTypingUsers(prev => prev.filter(user => user.id !== data.user.id));
      }
    });

    // Eventos de erro
    newSocket.on('error', (data) => {
      console.error('❌ Erro:', data.message);
      onErrorRef.current?.(data.message);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: { id: 'system', name: 'Sistema' },
        content: `Erro: ${data.message}`,
        timestamp: new Date().toISOString(),
        type: 'system',
        chat_type: 'general'
      }]);
    });

    setSocket(newSocket);

    // Cleanup na desmontagem
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      newSocket.close();
      setSocket(null);
      setIsConnected(false);
      setIsAuthenticated(false);
    };
  }, [session?.accessToken, sessionId]);

  // Funções de ação memoizadas
  const sendMessage = useCallback((content: string, chatType: 'general' | 'master') => {
    if (!socket || !content.trim() || !isAuthenticated || !session?.user) return;

    // Adicionar mensagem localmente imediatamente para UX
    const localMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: { 
        id: session.user.id, 
        name: session.user.name || 'Você',
        avatar: session.user.avatar || undefined
      },
      content: content.trim(),
      timestamp: new Date().toISOString(),
      type: 'user',
      chat_type: chatType,
      senderRole: chatType === 'master' ? 'master' : 'player'
    };
    
    setMessages(prev => [...prev, localMessage]);
    
    socket.emit('send_message', {
      sessionId,
      content: content.trim(),
      chat_type: chatType
    });
    
    // Parar indicador de digitação
    if (isTyping) {
      setIsTyping(false);
      socket.emit('typing_stop', { sessionId });
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  }, [socket, sessionId, isAuthenticated, session?.user, isTyping]);

  const startTyping = useCallback(() => {
    if (!socket || !isAuthenticated || isTyping) return;
    
    setIsTyping(true);
    socket.emit('typing_start', { sessionId });
    
    // Auto-parar digitação após 1 segundo
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('typing_stop', { sessionId });
    }, 1000);
  }, [socket, sessionId, isAuthenticated, isTyping]);

  const stopTyping = useCallback(() => {
    if (!socket || !isAuthenticated || !isTyping) return;
    
    setIsTyping(false);
    socket.emit('typing_stop', { sessionId });
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, [socket, sessionId, isAuthenticated, isTyping]);

  const joinSession = useCallback(() => {
    if (!socket || !sessionId || !isAuthenticated) return;
    socket.emit('join_session', { sessionId });
  }, [socket, sessionId, isAuthenticated]);

  const leaveSession = useCallback(() => {
    if (!socket || !sessionId) return;
    socket.emit('leave_session', { sessionId });
  }, [socket, sessionId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentPage(1);
  }, []);

  // Função para carregar mais mensagens
  const loadMoreMessages = useCallback(async (chatType: 'general' | 'master') => {
    if (!session?.accessToken || isLoadingMessages) return;

    try {
      setIsLoadingMessages(true);
      const apiMessages = await sessionService.getMessages(sessionId, {
        chat_type: chatType,
        page: currentPage,
        limit: 10
      });

      // Converter mensagens da API para o formato do chat
      const convertedMessages: ChatMessage[] = apiMessages.map((msg: ApiMessage) => ({
        id: msg.id,
        sender: {
          id: msg.sender_id,
          name: msg.sender?.name || 'Usuário',
          avatar: msg.sender?.avatar || undefined
        },
        content: msg.content,
        timestamp: msg.timestamp,
        type: msg.type,
        chat_type: msg.chat_type,
        senderRole: msg.chat_type === 'master' ? 'master' : 'player'
      }));

      // Adicionar mensagens no início (ordem cronológica)
      setMessages(prev => [...convertedMessages.reverse(), ...prev]);
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      onErrorRef.current?.(error instanceof Error ? error.message : 'Erro ao carregar mensagens');
    } finally {
      setIsLoadingMessages(false);
    }
  }, [session?.accessToken, sessionId, currentPage, isLoadingMessages]);

  // Carregar mensagens iniciais quando conectar
  useEffect(() => {
    if (isAuthenticated && messages.length === 0) {
      loadMoreMessages('general');
    }
  }, [isAuthenticated, messages.length, loadMoreMessages]);

  // Retorno memoizado
  return useMemo(() => ({
    socket,
    isAuthenticated,
    isConnected,
    messages,
    typingUsers,
    isLoadingMessages,
    loadMoreMessages,
    sendMessage,
    startTyping,
    stopTyping,
    joinSession,
    leaveSession,
    clearMessages
  }), [
    socket,
    isAuthenticated, 
    isConnected,
    messages,
    typingUsers,
    isLoadingMessages,
    loadMoreMessages,
    sendMessage,
    startTyping,
    stopTyping,
    joinSession,
    leaveSession,
    clearMessages
  ]);
}; 