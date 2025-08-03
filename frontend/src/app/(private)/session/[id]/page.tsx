'use client';

import { useParams, useRouter } from 'next/navigation';
import { GameSessionLayout } from '@/components/templates/GameSessionLayout';
import { useSessionByIdQuery } from '@/queries/session/queries';
import { useEffect, useState } from 'react';
import { Session } from '@/schemas/entities/session';
import { useSessionCharactersQuery } from '@/queries/character/queries';
import { Character } from '@/schemas/entities/character';
import { useSessionNotesQuery } from '@/queries/notes/queries';
import { Note } from '@/schemas/entities/notes';
import { Box } from '@mui/material';
import Loading from '@/components/molecules/Loading';

export interface SessionData extends Session {
  characters: Character[] | [];
  notes: Note[] | [];
}

export default function GameSessionPage() {
  const { id: sessionId } = useParams();
  const router = useRouter();

  const { data: session, isLoading } = useSessionByIdQuery(sessionId as string);
  const { data: characters, isLoading: isCharactersLoading } = useSessionCharactersQuery(
    sessionId as string
  );
  const { data: notes, isLoading: isNotesLoading } = useSessionNotesQuery(sessionId as string);

  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  const updateSessionData = (session: SessionData) => {
    setSessionData(session);
  };

  useEffect(() => {
    if (!session) return;

    setSessionData({
      ...session,
      characters: characters || [],
      notes: notes?.data || [],
    });
  }, [session, characters, notes]);

  if (!sessionData || isLoading || isCharactersLoading || isNotesLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Loading />
      </Box>
    );

  if (!sessionData) return router.push('/');

  return <GameSessionLayout sessionData={sessionData} updateSessionData={updateSessionData} />;
}
