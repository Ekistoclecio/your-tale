import NextAuth, { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { jwtDecode } from 'jwt-decode';
import { ApiServiceInstance } from '@/services/client';

export interface LoginTokenDecoded {
  id: number;
}

const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'password', type: 'password' },
      },

      async authorize(credentials) {
        const { data: loginToken } = await ApiServiceInstance.post<string>('/auth', {
          email: credentials?.email,
          password: credentials?.password,
        });

        if (loginToken) {
          const decodedLoginToken = jwtDecode<LoginTokenDecoded>(loginToken);
          return {
            id: decodedLoginToken.id,
            accessToken: loginToken,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: Number(user.id),
        };
        token.accessToken = (user as User & { accessToken: string }).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as User;
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
};

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
