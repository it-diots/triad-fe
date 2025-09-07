/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@triad/eslint-config/base", "plugin:react/recommended"],
  plugins: ["react"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/jsx-uses-react": "off",
    "react/jsx-uses-vars": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  env: {
    browser: true,
  },
};
