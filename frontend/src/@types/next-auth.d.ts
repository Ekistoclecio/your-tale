import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
    } & DefaultSession['user'];
    accessToken?: string;
  }

  interface User extends DefaultUser {
    id: number;
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    user?: {
      id: number;
    };
  }
}
