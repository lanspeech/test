import type { Metadata } from 'next';

import SignupForm from '@/components/auth/signup-form';

export const metadata: Metadata = {
  title: 'Create an account | Prompt Studio',
};

export default function SignupPage() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col items-center">
      <SignupForm />
    </section>
  );
}
