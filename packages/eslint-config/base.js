/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
  ignorePatterns: [
    "**/*.config.js",
    "**/*.config.ts",
    "**/*.config.cjs",
    "**/.eslintrc.cjs",
    "**/tailwind.config.*",
    "**/next.config.*",
    "**/vite.config.*",
    ".next",
    "dist",
    "pnpm-lock.yaml",
  ],
};
