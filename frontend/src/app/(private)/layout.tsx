'use client';

import { Header } from '@/components/organisms';
import { ReactNode } from 'react';
import * as S from './layoutStyles';
import { useSession } from 'next-auth/react';

interface PrivateLayoutProps {
  children: ReactNode;
}

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  const { data: session } = useSession();

  return (
    <S.Wrapper>
      <Header user={session?.user} />
      <S.Content>{children}</S.Content>
    </S.Wrapper>
  );
}
