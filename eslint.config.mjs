import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  // `.claude` contient des worktrees : des copies figees des sources, qui
  // remontaient les memes erreurs en double ou en triple.
  { ignores: ['dist', 'scripts', '.claude'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Existing codebase uses setState in effect body for initial sync : warn, not error
      'react-hooks/set-state-in-effect': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  // Fichiers CommonJS (fonctions Vercel, module hybride de l'assistant) :
  // globals Node pour module/require/process
  {
    files: ['api/**/*.js', 'src/assistant/knowledge.js', 'src/server/**/*.js'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
]
