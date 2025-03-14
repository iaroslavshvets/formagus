// ts-check
import jsEslint from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import deMorgan from 'eslint-plugin-de-morgan';
import vitest from '@vitest/eslint-plugin';
import tsEslint from '@typescript-eslint/eslint-plugin';
import eslintPluginImportX from 'eslint-plugin-import-x'
import globals from 'globals';
import {createTypeScriptImportResolver} from 'eslint-import-resolver-typescript';

/** @type {import('eslint').Linter.Config[]} */
const config  = [
  {
    files: ['**/*.@(mjs|js|ts|tsx)'],
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: [
            'packages/*/tsconfig.json'
          ]
        }),
      ]
    },
    plugins: {
      prettier,
      'de-morgan': deMorgan,
      vitest,
      '@typescript-eslint': tsEslint,
      'import-x': eslintPluginImportX,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...eslintPluginImportX.flatConfigs.recommended.rules,
      ...eslintPluginImportX.flatConfigs.typescript.rules,
      ...prettier.configs.recommended.rules,
      ...jsEslint.configs.recommended.rules,
      ...vitest.configs.recommended.rules,
      ...deMorgan.rules.recommended,
      ...tsEslint.configs['stylistic-type-checked'].rules,
      ...tsEslint.configs['strict-type-checked'].rules,
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {prefer: 'type-imports', fixStyle: 'inline-type-imports'},
      ],
      'import-x/consistent-type-specifier-style': ['error', 'prefer-inline'],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-return': 'off'
    },
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },
  {
    files: ['src/**/*.spec.{ts,tsx}', 'src/**/spec-setup.ts'],
    languageOptions: {
      globals: {
        ...globals.vitest,
      },
    },
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  },
];

export default config;
