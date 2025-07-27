'use client';

import { Header } from '@/components/organisms';
import { ReactNode } from 'react';
import * as S from './layoutStyles';

interface PrivateLayoutProps {
  children: ReactNode;
}

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  const handleCreateSession = () => {
    console.log('Criar nova sessão');
  };

  const handleEnterCode = () => {
    console.log('Entrar com código');
  };

  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '',
  };

  return (
    <S.Wrapper>
      <Header onCreateSession={handleCreateSession} onEnterCode={handleEnterCode} user={user} />
      <S.Content>{children}</S.Content>
    </S.Wrapper>
  );
}
