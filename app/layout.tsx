import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Baloo_2, Fira_Code, Plus_Jakarta_Sans } from 'next/font/google';
import Providers from '@/app/providers';
import SiteHeader from '@/components/site-header';
import { getCurrentSession } from '@/lib/auth/session';
import './globals.css';

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const display = Baloo_2({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const mono = Fira_Code({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Prompt Studio',
  description: 'Craft expressive AI prompt experiences with confidence and color.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getCurrentSession();

  return (
    <html lang="en">
      <body
        className={`${sans.variable} ${display.variable} ${mono.variable} min-h-screen bg-brand-canvas text-brand-ink`}
      >
        <Providers session={session}>
          <div className="relative min-h-screen overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0 bg-brand-gradient opacity-80"
              aria-hidden="true"
            />
            <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-10 sm:px-6 lg:px-10">
              <SiteHeader session={session} />
              <main className="mt-12 flex-1">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
