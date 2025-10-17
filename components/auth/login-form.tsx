'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: 'Invalid email or password.',
  AccessDenied: 'You do not have access to this resource.',
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/prompts';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(ERROR_MESSAGES[errorParam] ?? 'Unable to sign in. Please try again.');
    }
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    if (!result) {
      setError('Unexpected error while signing in.');
      setIsSubmitting(false);
      return;
    }

    if (result.error) {
      setError(ERROR_MESSAGES[result.error] ?? result.error);
      setIsSubmitting(false);
      return;
    }

    setSuccess('Signed in successfully. Redirecting…');
    router.push(result.url ?? callbackUrl);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-2xl bg-white/80 p-8 shadow-glow backdrop-blur"
    >
      <h2 className="font-display text-3xl text-brand-primary">Welcome back</h2>
      <p className="mt-2 text-sm text-brand-ink/70">
        Sign in to access your prompt collections and collaborative workspace.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-brand-ink">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-xl border border-brand-ink/10 bg-white/80 px-4 py-3 text-brand-ink shadow-inner focus:border-brand-primary/60 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-brand-ink">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-xl border border-brand-ink/10 bg-white/80 px-4 py-3 text-brand-ink shadow-inner focus:border-brand-primary/60 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </p>
      ) : null}

      <button
        type="submit"
        className="mt-6 w-full rounded-full bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow-dreamy transition hover:-translate-y-0.5 hover:bg-brand-secondary disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="mt-6 text-center text-sm text-brand-ink/70">
        Need an account?{' '}
        <Link href="/signup" className="font-semibold text-brand-primary hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
