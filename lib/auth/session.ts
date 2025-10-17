import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';

import { authOptions } from '@/lib/auth/options';

export async function getCurrentSession(): Promise<Session | null> {
  return getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user ?? null;
}
