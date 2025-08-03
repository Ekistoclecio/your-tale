'use client';

import { Box, useTheme, useMediaQuery } from '@mui/material';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PlayerList, SessionBar } from '@/components/molecules';
import { BoardMap, ChatPanel } from '@/components/organisms';
import * as S from './styles';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import { useStartSession } from '@/queries/session/mutation';
import { SessionData } from '@/app/(private)/session/[id]/page';
import { Character } from '@/schemas/entities/character';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useUpdateCharacter } from '@/queries/character/mutation';
import { Note } from '@/schemas/entities/notes';

interface GameSessionLayoutProps {
  sessionData: SessionData;
  updateSessionData: (session: SessionData) => void;
}

export const GameSessionLayout = ({ sessionData, updateSessionData }: GameSessionLayoutProps) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { data: session } = useSession();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const isMaster = useMemo(
    () => sessionData.creator?.id === session?.user?.id && !sessionData.is_ai_master,
    [sessionData, session]
  );

  const { mutateAsync: updateCharacter } = useUpdateCharacter();

  // Hook do WebSocket
  const { onlineUsers } = useWebSocket({
    sessionId: sessionData.id,
    onConnectionChange: (connected) => {
      console.log('Status da conexão WebSocket:', connected);
    },
    onError: (error) => {
      enqueueSnackbar(`Erro de conexão: ${error}`, { variant: 'error' });
    },
  });

  const { mutateAsync: startSession } = useStartSession();

  const handleStartSession = async () => {
    try {
      await startSession(sessionData.id);
      updateSessionData({ ...sessionData, status: 'active' });
      enqueueSnackbar('Sessão iniciada com sucesso', { variant: 'success' });
    } catch {
      enqueueSnackbar('Erro ao iniciar sessão', { variant: 'error' });
    }
  };

  const handleTokenMove = async (id: string, pos: { x: number; y: number }) => {
    const updatedCharacters = sessionData.characters
      .map((c) => (c.id === id ? { ...c, position: pos } : c))
      .find((c) => c.id === id);
    try {
      await updateCharacter(updatedCharacters as Character);
      updateSessionData({
        ...sessionData,
        characters: sessionData.characters.map((c) => (c.id === id ? { ...c, position: pos } : c)),
      });
    } catch {
      enqueueSnackbar('Erro ao atualizar personagem', { variant: 'error' });
    }
  };

  const handleSaveCharacter = (character: Character) => {
    updateSessionData({
      ...sessionData,
      characters: sessionData.characters.map((c) => (c.id === character.id ? character : c)),
    });
  };

  const handleUpdateNotes = (notes: Note[]) => {
    updateSessionData({
      ...sessionData,
      notes,
    });
  };

  return (
    <S.LayoutContainer>
      <S.ContentArea>
        <SessionBar
          title={sessionData.title}
          status={sessionData.status}
          isMaster={sessionData.creator?.id === session?.user?.id}
          onStartSession={handleStartSession}
          joinCode={sessionData.join_code}
        />

        <S.MainContainer>
          {/* Painel Esquerdo */}
          <S.LeftPanel sx={{ display: { xs: 'none', lg: 'block' } }}>
            <PlayerList
              players={sessionData.characters}
              onlineUsers={onlineUsers}
              currentUserId={session?.user?.id || ''}
              userRole={isMaster ? 'master' : 'player'}
              onSaveCharacter={handleSaveCharacter}
            />
          </S.LeftPanel>

          {/* Painel Central */}
          <S.CenterPanel>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              style={{ height: '100%' }}
            >
              <BoardMap
                players={sessionData.characters}
                isMaster={isMaster}
                onTokenMove={handleTokenMove}
              />
            </motion.div>
          </S.CenterPanel>

          {/* Painel Direito */}
          <S.RightPanel sx={{ display: { xs: 'none', lg: 'block' } }}>
            <ChatPanel
              sessionId={sessionData.id}
              currentUserId={session?.user?.id || ''}
              isMaster={isMaster}
              notes={sessionData.notes}
              onUpdateNotes={handleUpdateNotes}
            />
          </S.RightPanel>
        </S.MainContainer>

        {/* Chat Mobile Overlay */}
        {isMobile && (
          <S.MobileChatOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: mobileChatOpen ? 1 : 0 }}
            style={{ display: mobileChatOpen ? 'flex' : 'none' }}
          >
            <ChatPanel
              sessionId={sessionData.id}
              currentUserId={session?.user?.id || ''}
              isMaster={isMaster}
              notes={sessionData.notes}
              onUpdateNotes={handleUpdateNotes}
            />
          </S.MobileChatOverlay>
        )}
      </S.ContentArea>

      {/* Botão Flutuante Mobile */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            zIndex: 1001,
          }}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileChatOpen(!mobileChatOpen)}
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.secondary.contrastText,
              border: 'none',
              boxShadow: theme.shadows[8],
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}
          >
            💬
          </motion.button>
        </Box>
      )}
    </S.LayoutContainer>
  );
};
