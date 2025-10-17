import Link from 'next/link';
import type { Session } from 'next-auth';

import SignOutButton from '@/components/sign-out-button';

interface SiteHeaderProps {
  session: Session | null;
}

export default function SiteHeader({ session }: SiteHeaderProps) {
  const isAuthenticated = Boolean(session?.user);

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Link
        href="/"
        className="inline-flex items-center gap-3 rounded-full bg-white/70 px-4 py-2 font-display text-xl text-brand-primary shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
      >
        <span className="size-2 rounded-full bg-brand-secondary" aria-hidden="true" />
        Prompt Studio
      </Link>
      <nav className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <Link
              href="/prompts"
              className="inline-flex items-center rounded-full border border-transparent bg-white/70 px-4 py-2 text-sm font-semibold text-brand-primary shadow-sm transition hover:-translate-y-0.5 hover:border-brand-primary/40"
            >
              Prompts
            </Link>
            <Link
              href="/account"
              className="inline-flex items-center rounded-full border border-transparent bg-white/70 px-4 py-2 text-sm font-semibold text-brand-primary shadow-sm transition hover:-translate-y-0.5 hover:border-brand-primary/40"
            >
              Account
            </Link>
            <SignOutButton />
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="inline-flex items-center rounded-full border border-brand-primary/40 bg-transparent px-4 py-2 text-sm font-semibold text-brand-primary transition hover:-translate-y-0.5 hover:bg-white/80"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-secondary"
            >
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
