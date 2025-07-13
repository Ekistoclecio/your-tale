import type { Metadata } from 'next';
import { AppProviders } from '@/providers';
import { Pirata_One, Cinzel } from 'next/font/google';

const pirataOne = Pirata_One({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pirata-one',
});

const cinzel = Cinzel({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cinzel',
});

export const metadata: Metadata = {
  title: 'YourTale',
  description: 'Uma plataforma para seções de RPG de mesa online assistidas por IA',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${pirataOne.variable} ${cinzel.variable}`}>
      <AppProviders>
        <body>{children}</body>
      </AppProviders>
    </html>
  );
}
