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

  const handleProfile = () => {
    console.log('Abrir perfil');
  };

  const handleLogout = () => {
    console.log('Fazer logout');
  };

  const user = {
    name: 'John Doe',
    avatar: '',
  };

  return (
    <S.Wrapper>
      <Header
        onCreateSession={handleCreateSession}
        onEnterCode={handleEnterCode}
        onProfile={handleProfile}
        onLogout={handleLogout}
        user={user}
      />
      <S.Content>{children}</S.Content>
    </S.Wrapper>
  );
}
