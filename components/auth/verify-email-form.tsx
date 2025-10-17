'use client';

import { useCallback, useEffect, useState } from 'react';

interface VerifyEmailFormProps {
  initialToken?: string;
}

export default function VerifyEmailForm({ initialToken }: VerifyEmailFormProps) {
  const [token, setToken] = useState(initialToken ?? '');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const verify = useCallback(
    async (value: string) => {
      if (!value) {
        setStatus('error');
        setMessage('Please provide a verification token.');
        return;
      }

      setIsSubmitting(true);
      setStatus('idle');
      setMessage(null);

      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: value }),
        });

        const data = (await response.json().catch(() => ({}))) as {
          message?: string;
          success?: boolean;
          error?: string;
        };

        if (!response.ok) {
          setStatus('error');
          setMessage(data.error ?? data.message ?? 'Unable to verify your email.');
          return;
        }

        setStatus(data.success ? 'success' : 'error');
        setMessage(data.message ?? 'Email verified successfully.');
      } catch (error) {
        console.error('Verify email error:', error);
        setStatus('error');
        setMessage('Something went wrong while verifying your email.');
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  useEffect(() => {
    if (initialToken) {
      void verify(initialToken);
    }
  }, [initialToken, verify]);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await verify(token);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <label htmlFor="token" className="block text-sm font-semibold text-brand-ink">
        Verification token
      </label>
      <input
        id="token"
        name="token"
        value={token}
        onChange={(event) => setToken(event.target.value)}
        placeholder="Paste your verification token"
        className="w-full rounded-xl border border-brand-ink/10 bg-white/80 px-4 py-3 font-mono text-xs text-brand-ink shadow-inner focus:border-brand-primary/60 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
      />
      {message ? (
        <p
          className={`rounded-lg border px-4 py-3 text-sm ${
            status === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-red-200 bg-red-50 text-red-600'
          }`}
        >
          {message}
        </p>
      ) : null}
      <button
        type="submit"
        className="w-full rounded-full bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow-dreamy transition hover:-translate-y-0.5 hover:bg-brand-secondary disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Verifying…' : 'Verify email'}
      </button>
    </form>
  );
}
