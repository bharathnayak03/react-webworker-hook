module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb',
    "plugin:@typescript-eslint/recommended"
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  plugins: [
    'react',
    'react-hooks',
  ],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "import/no-extraneous-dependencies": ["error", { "peerDependencies": true }]
  },
};
