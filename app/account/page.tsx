import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getCurrentSession } from '@/lib/auth/session';
import prisma from '@/lib/prisma';

export default async function AccountPage() {
  const session = await getCurrentSession();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <section className="mx-auto max-w-3xl rounded-2xl bg-white/80 p-8 shadow-glow backdrop-blur">
      <h1 className="font-display text-3xl text-brand-primary">Account settings</h1>
      <p className="mt-2 text-sm text-brand-ink/70">
        Manage your profile details and authentication preferences. Email verification is required before accessing
        private prompt collections.
      </p>

      <dl className="mt-8 space-y-4">
        <div>
          <dt className="text-xs uppercase tracking-wide text-brand-ink/50">Name</dt>
          <dd className="text-brand-ink/90">{user.name ?? 'Not set'}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-brand-ink/50">Email</dt>
          <dd className="text-brand-ink/90">{user.email}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-brand-ink/50">Role</dt>
          <dd className="text-brand-ink/90">{user.role.toLowerCase()}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-brand-ink/50">Email verification</dt>
          <dd>
            {user.emailVerified ? (
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase text-emerald-700">
                Verified
              </span>
            ) : (
              <div className="space-y-2">
                <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase text-amber-700">
                  Pending
                </span>
                <p className="text-sm text-brand-ink/70">
                  Complete verification to unlock the full prompt library. Paste your token on the verification
                  page or request a new one.
                </p>
                <Link
                  href="/verify-email"
                  className="inline-flex items-center rounded-full bg-brand-primary px-4 py-2 text-xs font-semibold uppercase text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-secondary"
                >
                  Verify email
                </Link>
              </div>
            )}
          </dd>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-brand-ink/50">Member since</dt>
            <dd className="text-brand-ink/90">{user.createdAt.toLocaleDateString()}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-brand-ink/50">Last updated</dt>
            <dd className="text-brand-ink/90">{user.updatedAt.toLocaleDateString()}</dd>
          </div>
        </div>
      </dl>
    </section>
  );
}
