module.exports = {
  extends: ["turbo", "prettier"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-hooks"],
  rules: {
    "no-console": ["warn"],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": [
      "warn",
      {
        additionalHooks: "(useEditor)",
      },
    ],
  },
};
