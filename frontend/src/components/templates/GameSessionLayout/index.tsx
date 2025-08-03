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

// interface SessionData {
//   id: string;
//   title: string;
//   status: 'not_started' | 'active' | 'paused' | 'ended';
//   currentUser: {
//     id: string;
//     role: 'player' | 'master';
//   };
//   players: Array<{
//     id: string;
//     name: string;
//     playerName: string;
//     avatar?: string;
//     level: number;
//     class: string;
//     race: string;
//     hp: { current: number; max: number };
//     mana?: { current: number; max: number };
//     status: 'alive' | 'unconscious' | 'dead';
//     position: { x: number; y: number };
//     isOnline?: boolean;
//     attributes: {
//       strength: { value: number; modifier: number };
//       dexterity: { value: number; modifier: number };
//       constitution: { value: number; modifier: number };
//       intelligence: { value: number; modifier: number };
//       wisdom: { value: number; modifier: number };
//       charisma: { value: number; modifier: number };
//     };
//     conditions: string[];
//     appearance: string;
//     backstory: string;
//     personality: string;
//     ideals: string;
//     bonds: string;
//     flaws: string;
//     notes: string;
//     inventory: Array<{ id: string; name: string; quantity: number; description?: string }>;
//   }>;
//   joinCode: string;
//   mapImage?: string;
//   messages: Array<{
//     id: string;
//     senderId: string;
//     senderName: string;
//     content: string;
//     timestamp: Date;
//     type: 'user' | 'ai' | 'system';
//     chatType: 'general' | 'master';
//     senderRole?: 'player' | 'master';
//     avatar?: string;
//   }>;
//   notes: Array<{
//     id: string;
//     title: string;
//     content: string;
//     timestamp: Date;
//   }>;
// }

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

  const handleRollDice = (exp?: string) => console.log('Rolando dados:', exp || '1d20');

  const handleTokenMove = (id: string, pos: { x: number; y: number }) =>
    console.log('Movendo token:', { id, pos });

  const handleSaveCharacter = (character: Character) => {
    updateSessionData({
      ...sessionData,
      characters: sessionData.characters.map((c) => (c.id === character.id ? character : c)),
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
              onRollDice={handleRollDice}
              notes={[]}
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
              onRollDice={handleRollDice}
              notes={[]}
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
