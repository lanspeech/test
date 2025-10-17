'use client';

import { useTransition } from 'react';
import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut({ callbackUrl: '/' });
    });
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isPending}
      className="inline-flex items-center justify-center rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-secondary disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
