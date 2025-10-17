import { type UserRole } from '@prisma/client';
import { type DefaultSession, type DefaultUser } from 'next-auth';
import { type JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: DefaultSession['user'] & {
      id: string;
      role: UserRole;
      emailVerified: boolean;
    };
  }

  interface User extends DefaultUser {
    role: UserRole;
    emailVerified: Date | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    emailVerified: boolean;
  }
}
