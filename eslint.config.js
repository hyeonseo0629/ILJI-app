// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    files: ['app/**/*.tsx'],
    rules: {
      // This rule is disabled for the app directory because Expo Router uses default
      // exports to define routes, which the linter incorrectly flags as unused.
      'import/no-unused-modules': 'off',
    },
  },
  {
    ignores: ['dist/*'],
  },
]);
