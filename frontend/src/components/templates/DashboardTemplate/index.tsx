'use client';

import { useEffect, useState } from 'react';
import { Container, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import {
  EnterCodeModal,
  MySessionsEmptyState,
  PublicSessionsEmptyState,
  HeroBanner,
} from '../../molecules';
import { CreateSessionModal } from '../../organisms';
import { SessionSection } from '../../organisms/SessionSection';
import Scroll from '@/assets/icons/scroll.svg';
import Explore from '@/assets/icons/explore.svg';
import { animationVariants } from '@/constants/animation';
import { fetchGetMySessions, fetchGetPublicSessions } from '@/queries/session/fetch';
import { useSnackbar } from 'notistack';
import { Session } from '@/schemas/entities/session';
import { DEFAULT_LIMIT } from '@/queries/client';

export const DashboardTemplate = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [enterCodeModalOpen, setEnterCodeModalOpen] = useState(false);
  const [createSessionModalOpen, setCreateSessionModalOpen] = useState(false);

  const [sessions, setSessions] = useState<{
    public: Session[];
    user: Session[];
  }>({
    public: [],
    user: [],
  });

  const [publicSessionsPagination, setPublicSessionsPagination] = useState({
    page: 1,
    totalItens: 0,
    isFetching: false,
  });
  const [userSessionsPagination, setUserSessionsPagination] = useState({
    page: 1,
    totalItens: 0,
    isFetching: false,
  });

  const handleGetPublicSessions = async (page: number = publicSessionsPagination.page) => {
    if (publicSessionsPagination.isFetching) return;
    try {
      setPublicSessionsPagination((prev) => ({ ...prev, isFetching: true }));
      const publicSessions = await fetchGetPublicSessions(page);
      setSessions((prev) => ({ ...prev, public: publicSessions.data }));
      setPublicSessionsPagination((prev) => ({
        ...prev,
        totalItens: publicSessions.totalPages,
        page: publicSessions.currentPage,
      }));
    } catch {
      enqueueSnackbar('Erro ao buscar sessões públicas', { variant: 'error' });
    } finally {
      setPublicSessionsPagination((prev) => ({ ...prev, isFetching: false }));
    }
  };

  const handleGetMySessions = async (page: number = userSessionsPagination.page) => {
    if (userSessionsPagination.isFetching) return;
    try {
      setUserSessionsPagination((prev) => ({ ...prev, isFetching: true }));
      const mySessions = await fetchGetMySessions(page);
      setSessions((prev) => ({ ...prev, user: mySessions.data }));
      setUserSessionsPagination((prev) => ({
        ...prev,
        totalItens: mySessions.totalPages,
        page: mySessions.currentPage,
      }));
    } catch {
      enqueueSnackbar('Erro ao buscar sessões do usuário', { variant: 'error' });
    } finally {
      setUserSessionsPagination((prev) => ({ ...prev, isFetching: false }));
    }
  };

  const handleCreateSession = () => setCreateSessionModalOpen(true);
  const handleEnterCode = () => setEnterCodeModalOpen(true);

  const handleViewSessions = () => {
    const userSessionsSection = document.getElementById('user-sessions-section');
    if (userSessionsSection) {
      userSessionsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    handleGetPublicSessions();
    handleGetMySessions();
  }, []);

  return (
    <>
      <Container maxWidth="xl" sx={{ pt: 3, pb: 6, overflow: 'visible' }}>
        <motion.div variants={animationVariants.staggerChildren} initial="hidden" animate="visible">
          <motion.div
            variants={animationVariants.fadeSlideInChildren}
            style={{ marginBottom: '2rem' }}
          >
            <HeroBanner
              onCreateSession={handleCreateSession}
              onEnterCode={handleEnterCode}
              onViewSessions={handleViewSessions}
            />
          </motion.div>

          {/* <motion.div
            variants={animationVariants.fadeSlideInChildren}
            style={{ marginBottom: '2rem' }}
          >
            <AISuggestions />
          </motion.div> */}

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
              sessions={sessions.public}
              loading={publicSessionsPagination.isFetching}
              page={publicSessionsPagination.page}
              totalPages={Math.ceil(publicSessionsPagination.totalItens / DEFAULT_LIMIT)}
              onPageChange={(page) => handleGetPublicSessions(page)}
              emptyState={<PublicSessionsEmptyState onCreateSession={handleCreateSession} />}
            />

            <SessionSection
              id="user-sessions-section"
              title="Minhas campanhas"
              icon={<Scroll width={28} height={28} />}
              sessions={sessions.user}
              loading={userSessionsPagination.isFetching}
              emptyState={<MySessionsEmptyState onCreateSession={handleCreateSession} />}
              page={userSessionsPagination.page}
              totalPages={Math.ceil(userSessionsPagination.totalItens / DEFAULT_LIMIT)}
              onPageChange={(page) => handleGetMySessions(page)}
              isMySessions={true}
            />
          </Stack>
        </motion.div>
      </Container>
      <EnterCodeModal open={enterCodeModalOpen} onClose={() => setEnterCodeModalOpen(false)} />
      {createSessionModalOpen && (
        <CreateSessionModal
          open={createSessionModalOpen}
          onClose={() => setCreateSessionModalOpen(false)}
        />
      )}
    </>
  );
};
