/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint", "unused-imports", "simple-import-sort"],
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "warn",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "simple-import-sort/imports": "warn",
    "simple-import-sort/exports": "warn",
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
