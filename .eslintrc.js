module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'prettier'],
  ignorePatterns: ['.next', 'node_modules'],
  overrides: [
    {
      files: ['**/__tests__/**/*.{ts,tsx}', '**/?(*.)+(spec|test).{ts,tsx}'],
      env: {
        node: true,
      },
    },
  ],
};
