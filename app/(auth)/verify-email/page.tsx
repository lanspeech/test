import type { Metadata } from 'next';
import Link from 'next/link';

import VerifyEmailForm from '@/components/auth/verify-email-form';

type VerifyEmailPageProps = {
  searchParams: {
    token?: string;
  };
};

export const metadata: Metadata = {
  title: 'Verify email | Prompt Studio',
};

export default function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const initialToken = typeof searchParams?.token === 'string' ? searchParams.token : undefined;

  return (
    <section className="mx-auto max-w-3xl rounded-2xl bg-white/80 p-8 shadow-glow backdrop-blur">
      <h2 className="font-display text-3xl text-brand-primary">Verify your email</h2>
      <p className="mt-2 text-sm text-brand-ink/70">
        Check your inbox for a verification link. Because email delivery is still being wired up, you can also
        paste the token returned after sign-up to complete verification manually.
      </p>

      <VerifyEmailForm initialToken={initialToken} />

      <p className="mt-6 text-sm text-brand-ink/70">
        Need another token?{' '}
        <Link href="/signup" className="font-semibold text-brand-primary hover:underline">
          Create a new account
        </Link>{' '}
        or{' '}
        <Link href="/login" className="font-semibold text-brand-primary hover:underline">
          go back to sign in
        </Link>
        .
      </p>
    </section>
  );
}
