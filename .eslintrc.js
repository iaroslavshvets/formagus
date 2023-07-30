module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["isaacscript", "import", "prettier"],
  extends: [
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:prettier/recommended",
    "prettier",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  overrides: [
    {
      files: ["!./__tests__/**/*.{ts,tsx}"],
      extends: ["plugin:@typescript-eslint/disable-type-checked"],
    },
  ],
  rules: {
    // These off/not-configured-the-way-we-want lint rules we like & opt into
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_" },
    ],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { prefer: "type-imports", fixStyle: "inline-type-imports" },
    ],
    "import/consistent-type-specifier-style": ["error", "prefer-inline"],

    // For educational purposes we format our comments/jsdoc nicely
    "isaacscript/complete-sentences-jsdoc": "warn",
    "isaacscript/format-jsdoc-comments": "warn",
  },
};
