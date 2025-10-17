import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Baloo_2, Fira_Code, Plus_Jakarta_Sans } from 'next/font/google';
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

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sans.variable} ${display.variable} ${mono.variable} min-h-screen bg-brand-canvas text-brand-ink`}
      >
        <div className="relative min-h-screen overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 bg-brand-gradient opacity-80"
            aria-hidden="true"
          />
          <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-16">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
