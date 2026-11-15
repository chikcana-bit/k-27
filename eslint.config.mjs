import js from '@eslint/js';
import tseslint from 'typescript-eslint';

// .astro templates are type-checked by `astro check`; ESLint covers TS and Node scripts.
export default tseslint.config(
  { ignores: ['**/dist/**', '**/.astro/**', '**/node_modules/**', 'dist-pages/**', '**/*.astro'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { rules: { 'no-irregular-whitespace': 'off' } },
  {
    files: ['scripts/**/*.mjs', 'tests/**/*.mjs', 'shared/lib/*.mjs', '**/astro.config.mjs'],
    languageOptions: {
      globals: { process: 'readonly', console: 'readonly', URL: 'readonly', document: 'readonly', window: 'readonly', getComputedStyle: 'readonly' },
    },
  },
  {
    files: ['shared/**/*.ts', 'sites/**/*.ts'],
    languageOptions: {
      globals: { window: 'readonly', document: 'readonly', navigator: 'readonly', fetch: 'readonly' },
    },
  },
);
