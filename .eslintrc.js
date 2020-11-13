module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    semi: [2, 'always'],
    'no-console': 'off',
    camelcase: 'off',
    eqeqeq: 'off',
    'prefer-promise-reject-errors': 'off',
    'nuxt/no-cjs-in-config': 'off',
    'vue/attribute-hyphenation': 'off'
  }
};
