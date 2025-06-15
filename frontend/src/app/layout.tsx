import type { Metadata } from 'next';
import { AppProviders } from '@/providers';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
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
    <html lang="en" className={roboto.variable}>
      <AppProviders>
        <body>{children}</body>
      </AppProviders>
    </html>
  );
}
