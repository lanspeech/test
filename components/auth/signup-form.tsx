'use client';

import Link from 'next/link';
import { useState } from 'react';

interface SignupResponse {
  message?: string;
  error?: string;
  verificationToken?: string;
  expiresAt?: string;
}

export default function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setSuccess(null);
    setVerificationToken(null);
    setExpiresAt(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email,
          password,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as SignupResponse;

      if (!response.ok) {
        setError(data.error ?? 'Unable to create your account.');
        return;
      }

      setSuccess(
        data.message ??
          'Account created successfully! Check your inbox for the verification link to finish setting things up.'
      );
      setVerificationToken(data.verificationToken ?? null);
      setExpiresAt(data.expiresAt ?? null);
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Sign-up error:', err);
      setError('Something went wrong while creating your account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-2xl bg-white/80 p-8 shadow-glow backdrop-blur"
    >
      <h2 className="font-display text-3xl text-brand-primary">Create your account</h2>
      <p className="mt-2 text-sm text-brand-ink/70">
        Join Prompt Studio to save prompts, collaborate with teammates, and craft dazzling experiences.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-brand-ink">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-xl border border-brand-ink/10 bg-white/80 px-4 py-3 text-brand-ink shadow-inner focus:border-brand-primary/60 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            placeholder="Ava Promptsmith"
          />
        </div>
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
            placeholder="you@example.com"
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
            autoComplete="new-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-xl border border-brand-ink/10 bg-white/80 px-4 py-3 text-brand-ink shadow-inner focus:border-brand-primary/60 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            placeholder="Create a strong password"
          />
          <p className="mt-1 text-xs text-brand-ink/60">Use at least 8 characters with a mix of letters and numbers.</p>
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

      {verificationToken ? (
        <div className="mt-4 rounded-lg border border-brand-primary/30 bg-white/90 px-4 py-3 text-sm text-brand-ink/80">
          <p className="font-semibold text-brand-primary">Verification token (placeholder):</p>
          <p className="break-all font-mono text-xs text-brand-ink/80">{verificationToken}</p>
          {expiresAt ? (
            <p className="mt-1 text-xs text-brand-ink/60">
              Expires at: {new Date(expiresAt).toLocaleString()}
            </p>
          ) : null}
          <p className="mt-2 text-xs text-brand-ink/60">
            Paste this token into the verification screen or open the emailed link once integrations are enabled.
          </p>
        </div>
      ) : null}

      <button
        type="submit"
        className="mt-6 w-full rounded-full bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow-dreamy transition hover:-translate-y-0.5 hover:bg-brand-secondary disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating account…' : 'Create account'}
      </button>

      <p className="mt-6 text-center text-sm text-brand-ink/70">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-brand-primary hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
