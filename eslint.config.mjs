import importHelpers from 'eslint-plugin-import-helpers';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  {
    ignores: [
      'src/**/*.css',
      'node_modules/**',
      '.next/**',
      'dist/**',
      'build/**',
      '*.config.js',
      '*.config.ts',
      '*.config.mjs',
      'drizzle/**',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020,
        React: 'readonly',
        jest: 'readonly',
        cypress: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      '@typescript-eslint': typescriptEslint,
      'import-helpers': importHelpers,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/no-unused-prop-types': 'off',
      'react/function-component-definition': [
        'error',
        {
          namedComponents: ['function-declaration', 'arrow-function'],
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/jsx-filename-extension': [1, { extensions: ['.ts', '.tsx'] }],
      'react/jsx-props-no-spreading': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react/require-default-props': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'react/prop-types': 'off',
      'react/no-danger': 'off',

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/no-unused-vars': 'error',

      '@next/next/no-img-element': 'off',
      '@next/next/no-sync-scripts': 'off',
      '@next/next/no-html-link-for-pages': 'off',

      'import-helpers/order-imports': [
        'warn',
        {
          newlinesBetween: 'always',
          groups: [
            'module',
            '/^@\\//',
            ['parent', 'sibling', 'index'],
          ],
          alphabetize: {
            order: 'asc',
            ignoreCase: true,
          },
        },
      ],

      'class-methods-use-this': 'off',
      'no-console': 'off',
      'no-unused-vars': 'off',
      'no-param-reassign': [
        2,
        {
          props: false,
        },
      ],
      'max-len': ['error', { code: 120, ignoreStrings: true, ignoreUrls: true }],
      'no-shadow': 'off',

      'jsx-a11y/control-has-associated-label': 'off',
      'jsx-a11y/label-has-associated-control': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/anchor-is-valid': 'off',

      'prettier/prettier': 'off',
    },
  },
];

