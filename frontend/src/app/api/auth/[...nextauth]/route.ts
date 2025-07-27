import NextAuth, { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authService } from '@/services/auth';

const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const data = await authService.login({
          email: credentials.email,
          password: credentials.password,
        });

        if (!data?.token || !data?.user) return null;

        return {
          ...data.user,
          accessToken: data.token,
        };
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
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          created_at: user.created_at,
          updated_at: user.updated_at,
        };
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user as User;
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

const handler = NextAuth(nextAuthOptions);
export { handler as GET, handler as POST };
