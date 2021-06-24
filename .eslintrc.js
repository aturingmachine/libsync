module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['prettier'],
  extends: [
    'plugin:vue/essential',
    '@vue/prettier',
    '@vue/typescript/recommended',
    'plugin:@typescript-eslint/recommended',
    '@vue/prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': 'error',
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  overrides: [
    {
      files: ['*.ts', '*.js'],
      parser: '@typescript-eslint/parser',
    },
  ],
  ignorePatterns: ['*.vue'],
}
