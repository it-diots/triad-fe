/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    '@triad/eslint-config/react',
    'next/core-web-vitals',
  ],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
  },
  env: {
    node: true,
  },
};
