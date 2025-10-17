import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { compare } from 'bcryptjs';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { UserRole } from '@prisma/client';

import prisma from '@/lib/prisma';
import { applyRateLimit } from '@/lib/rate-limit';
import { loginSchema } from '@/lib/validations/auth';

const LOGIN_WINDOW_MS = 60 * 1000; // 1 minute
const LOGIN_ATTEMPT_LIMIT = 5;

function extractClientIdentifier(headers?: Record<string, string | string[] | undefined>) {
  if (!headers) return undefined;

  const forwarded = headers['x-forwarded-for'];

  if (Array.isArray(forwarded)) {
    return forwarded[0];
  }

  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0]?.trim() ?? undefined;
  }

  const realIp = headers['x-real-ip'];

  if (Array.isArray(realIp)) {
    return realIp[0];
  }

  if (typeof realIp === 'string' && realIp.length > 0) {
    return realIp;
  }

  return undefined;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials, req) => {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          throw new Error('Invalid login details provided.');
        }

        const { email, password } = parsed.data;
        const identifier = extractClientIdentifier(req?.headers ?? undefined) ?? email;
        const rateLimit = applyRateLimit({
          key: `signin:${identifier}`,
          limit: LOGIN_ATTEMPT_LIMIT,
          windowMs: LOGIN_WINDOW_MS,
        });

        if (!rateLimit.success) {
          throw new Error('Too many sign-in attempts. Please try again shortly.');
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.passwordHash) {
          throw new Error('Invalid email or password.');
        }

        const passwordMatches = await compare(password, user.passwordHash);

        if (!passwordMatches) {
          throw new Error('Invalid email or password.');
        }

        if (!user.emailVerified) {
          throw new Error('Please verify your email before signing in.');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified ?? null,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.emailVerified = !!user.emailVerified;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (typeof token.id === 'string') {
          session.user.id = token.id;
        }

        const role = (token.role as UserRole | undefined) ?? session.user.role ?? 'USER';
        session.user.role = role;
        session.user.emailVerified = Boolean(token.emailVerified);
      }

      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
};
