import type { Metadata } from 'next';

import LoginForm from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Sign in | Prompt Studio',
};

export default function LoginPage() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col items-center">
      <LoginForm />
    </section>
  );
}
