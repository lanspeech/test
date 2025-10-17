import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6366F1',
          secondary: '#F472B6',
          accent: '#FBBF24',
          canvas: '#F5F5F0',
          ink: '#1F2937',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'cursive'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular'],
      },
      boxShadow: {
        glow: '0 0 35px rgba(99, 102, 241, 0.4)',
        dreamy: '0 20px 45px -15px rgba(244, 114, 182, 0.45)',
      },
      backgroundImage: {
        'brand-gradient':
          'radial-gradient(circle at 20% 20%, rgba(99,102,241,0.25) 0, transparent 55%), radial-gradient(circle at 80% 30%, rgba(244,114,182,0.25) 0, transparent 55%), radial-gradient(circle at 40% 80%, rgba(251,191,36,0.25) 0, transparent 55%)',
      },
      borderRadius: {
        xl: '1.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
