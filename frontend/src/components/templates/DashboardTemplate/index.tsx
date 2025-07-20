'use client';

import { useState, useEffect } from 'react';
import { Container, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { EnterCodeModal } from '../../molecules/EnterCodeModal';
import { MySessionsEmptyState } from '../../molecules';
import { CreateSessionModal } from '../../organisms';
import { HeroBanner } from '../../molecules';
import { AISuggestions } from '../../organisms';
import { FloatingDice } from '../../atoms/FloatingDice';
import { SessionSection } from '../../organisms/SessionSection';
import Scroll from '@/assets/icons/scroll.svg';
import Explore from '@/assets/icons/explore.svg';

// Dados mockados para demonstração
const mockPublicSessions = [
  {
    id: '1',
    name: 'A Lenda do Vale Esquecido',
    description:
      'Uma jornada épica através de vales esquecidos, onde heróis enfrentarão criaturas míticas e descobrirão segredos ancestrais perdidos no tempo. Uma aventura que testará os limites da coragem e da sabedoria.',
    master: {
      name: 'Mestre Gandalf',
      type: 'human' as const,
    },
    status: 'active' as const,
    connected: false,
  },
  {
    id: '2',
    name: 'Dungeons & Dragons: Aventura Épica',
    description:
      'Uma campanha clássica de D&D com elementos modernos, onde os jogadores explorarão masmorras perigosas, enfrentarão dragões e descobrirão tesouros lendários.',
    master: {
      name: 'IA Dungeon Master',
      type: 'ai' as const,
    },
    status: 'active' as const,
    connected: false,
  },
  {
    id: '3',
    name: 'Pathfinder: Reino dos Anões',
    description:
      'Uma aventura no universo Pathfinder, onde os jogadores explorarão as profundezas das montanhas dos anões, descobrindo forjas lendárias e enfrentando ameaças subterrâneas.',
    master: {
      name: 'Mestre Thorin',
      type: 'human' as const,
    },
    status: 'scheduled' as const,
    scheduledDate: '17/07',
    connected: false,
  },
  {
    id: '4',
    name: 'Call of Cthulhu: Mistérios Profundos',
    description:
      'Uma investigação sobrenatural baseada no universo de H.P. Lovecraft, onde os investigadores descobrirão horrores cósmicos além da compreensão humana.',
    master: {
      name: 'Mestre Lovecraft',
      type: 'human' as const,
    },
    status: 'active' as const,
    connected: false,
  },
  {
    id: '5',
    name: 'Star Wars: A Guerra das Estrelas',
    description:
      'Uma aventura no universo Star Wars, onde os jogadores serão Jedi, Sith ou contrabandistas em uma galáxia muito, muito distante.',
    master: {
      name: 'IA Star Master',
      type: 'ai' as const,
    },
    status: 'active' as const,
    connected: false,
  },
  {
    id: '6',
    name: 'Vampire: The Masquerade',
    description:
      'Uma narrativa gótica onde os jogadores são vampiros em um mundo moderno, lutando por poder e sobrevivência nas sombras da sociedade.',
    master: {
      name: 'Mestre Nosferatu',
      type: 'human' as const,
    },
    status: 'scheduled' as const,
    scheduledDate: '20/07',
    connected: false,
  },
  {
    id: '7',
    name: 'Cyberpunk 2077: Night City',
    description:
      'Uma aventura cyberpunk em uma cidade futurista onde tecnologia e humanidade se entrelaçam de forma perigosa e emocionante.',
    master: {
      name: 'IA Cyber Master',
      type: 'ai' as const,
    },
    status: 'active' as const,
    connected: false,
  },
  {
    id: '8',
    name: 'The Witcher: Monstros e Magia',
    description:
      'Uma jornada no universo de The Witcher, onde os jogadores serão caçadores de monstros em um mundo de magia, política e criaturas sobrenaturais.',
    master: {
      name: 'Mestre Geralt',
      type: 'human' as const,
    },
    status: 'active' as const,
    connected: false,
  },
  {
    id: '9',
    name: 'Lord of the Rings: A Sociedade do Anel',
    description:
      'Uma aventura épica na Terra-média, onde os jogadores farão parte de uma missão para destruir o Um Anel e salvar o mundo da escuridão.',
    master: {
      name: 'IA Middle-earth Master',
      type: 'ai' as const,
    },
    status: 'scheduled' as const,
    scheduledDate: '25/07',
    connected: false,
  },
  {
    id: '10',
    name: 'Game of Thrones: Intrigas e Poder',
    description:
      'Uma campanha política no universo de Game of Thrones, onde os jogadores competirão pelo Trono de Ferro através de alianças, traições e batalhas épicas.',
    master: {
      name: 'Mestre Tywin',
      type: 'human' as const,
    },
    status: 'active' as const,
    connected: false,
  },
];

const mockUserSessions = [
  {
    id: '11',
    name: 'Minha Primeira Aventura',
    description:
      'Uma aventura introdutória perfeita para iniciantes, onde você aprenderá os fundamentos do RPG enquanto explora um mundo mágico cheio de possibilidades.',
    master: {
      name: 'IA Dungeon Master',
      type: 'ai' as const,
    },
    status: 'active' as const,
    lastAccess: 'há 2 dias',
  },
  {
    id: '12',
    name: 'Campanha dos Elfos',
    description:
      'Uma jornada através das florestas élficas, onde a magia e a natureza se entrelaçam. Uma história de amizade, coragem e a busca pela harmonia entre os povos.',
    master: {
      name: 'Mestre Legolas',
      type: 'human' as const,
    },
    status: 'ended' as const,
    lastAccess: 'há 1 semana',
  },
  {
    id: '13',
    name: 'Aventura Subterrânea',
    description:
      'Uma exploração das profundezas da terra, onde perigos e tesouros aguardam os aventureiros corajosos o suficiente para enfrentar as masmorras.',
    master: {
      name: 'IA Cave Master',
      type: 'ai' as const,
    },
    status: 'active' as const,
    lastAccess: 'há 3 dias',
  },
  {
    id: '14',
    name: 'Reino dos Dragões',
    description:
      'Uma campanha épica onde os jogadores enfrentarão dragões lendários e descobrirão os segredos de um reino esquecido.',
    master: {
      name: 'Mestre Drakon',
      type: 'human' as const,
    },
    status: 'scheduled' as const,
    scheduledDate: '30/07',
    lastAccess: 'há 5 dias',
  },
  {
    id: '15',
    name: 'Mistérios da Cidade',
    description:
      'Uma investigação urbana onde os jogadores desvendarão conspirações e mistérios em uma cidade cheia de segredos.',
    master: {
      name: 'IA Urban Master',
      type: 'ai' as const,
    },
    status: 'active' as const,
    lastAccess: 'ontem',
  },
];

export const DashboardTemplate = () => {
  const [enterCodeModalOpen, setEnterCodeModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [publicSessionsPage, setPublicSessionsPage] = useState(1);
  const [userSessionsPage, setUserSessionsPage] = useState(1);
  const [enterCodeLoading, setEnterCodeLoading] = useState(false);
  const [createSessionModalOpen, setCreateSessionModalOpen] = useState(false);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateSession = () => setCreateSessionModalOpen(true);
  const handleEnterCode = () => setEnterCodeModalOpen(true);
  const handleEnterCodeSubmit = async (code: string) => {
    setEnterCodeLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setEnterCodeLoading(false);
    setEnterCodeModalOpen(false);
    console.log('Entrar com código:', code);
  };

  const handleEnterSession = (sessionId: string) => console.log('Entrar na sessão:', sessionId);
  const handleViewCharacter = (sessionId: string) => console.log('Ver ficha da sessão:', sessionId);
  const handleViewSessions = () => {
    const userSessionsSection = document.getElementById('user-sessions-section');
    if (userSessionsSection) {
      userSessionsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ pt: 3, pb: 6, overflow: 'visible' }}>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
            <HeroBanner
              onCreateSession={handleCreateSession}
              onEnterCode={handleEnterCode}
              onViewSessions={handleViewSessions}
            />
          </motion.div>

          <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
            <AISuggestions />
          </motion.div>

          <Stack
            alignItems="flex-start"
            direction={{ xs: 'column', md: 'row' }}
            spacing={4}
            width="100%"
          >
            <SessionSection
              id="public-sessions-section"
              title="Sessões abertas à aventura"
              icon={<Explore width={28} height={28} />}
              sessions={mockPublicSessions.slice(
                (publicSessionsPage - 1) * ITEMS_PER_PAGE,
                publicSessionsPage * ITEMS_PER_PAGE
              )}
              loading={loading}
              onEnterSession={handleEnterSession}
              page={publicSessionsPage}
              totalPages={Math.ceil(mockPublicSessions.length / ITEMS_PER_PAGE)}
              onPageChange={setPublicSessionsPage}
            />

            <SessionSection
              id="user-sessions-section"
              title="Minhas campanhas"
              icon={<Scroll width={28} height={28} />}
              sessions={mockUserSessions.slice(
                (userSessionsPage - 1) * ITEMS_PER_PAGE,
                userSessionsPage * ITEMS_PER_PAGE
              )}
              loading={loading}
              onEnterSession={handleEnterSession}
              onViewCharacter={handleViewCharacter}
              emptyState={<MySessionsEmptyState onCreateSession={handleCreateSession} />}
              page={userSessionsPage}
              totalPages={Math.ceil(mockUserSessions.length / ITEMS_PER_PAGE)}
              onPageChange={setUserSessionsPage}
            />
          </Stack>
        </motion.div>
      </Container>
      <FloatingDice />
      <EnterCodeModal
        open={enterCodeModalOpen}
        onClose={() => setEnterCodeModalOpen(false)}
        onSubmit={handleEnterCodeSubmit}
        loading={enterCodeLoading}
      />
      {createSessionModalOpen && (
        <CreateSessionModal
          open={createSessionModalOpen}
          onClose={() => setCreateSessionModalOpen(false)}
          onSubmit={() => console.log('Criar nova sessão')}
        />
      )}
    </>
  );
};
