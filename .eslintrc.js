module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'prettier',
    'import',
    'unused-imports',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    // TypeScript specific rules
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-inferrable-types': 'warn',

    // Match ESLint with TypeScript Config
    '@typescript-eslint/strict-boolean-expressions': 'error', // Enforces strict boolean expressions
    '@typescript-eslint/no-non-null-assertion': 'warn', // Warns against using `!` for non-null assertions
    '@typescript-eslint/no-var-requires': 'error', // Disallow `require` statements except in import statements
    '@typescript-eslint/prefer-optional-chain': 'warn', // Suggest using optional chaining
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'], // Enforces using `interface` over `type` for object types

    // Best practices
    'no-console': 'warn',
    'no-debugger': 'warn',
    'curly': ['error', 'multi-line'],
    'eqeqeq': ['error', 'always'],
    'import/order': [
      'error',
      {
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      },
    ],
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ],

    // Prettier integration
    'prettier/prettier': 'error',
  },
};
