module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
  env: {
    // browser: true,
    es2021: true,
  },
  extends: [
    "turbo",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    // Make sure to put prettier last so it overrides the rest
    "prettier",
  ],
  plugins: [
    // To fix error: Definition for rule 'import/no-extraneous-dependencies' was not found
    "import",
    "@typescript-eslint",
  ],
  rules: {
    // Automatically flag env vars missing from turbo.json
    "turbo/no-undeclared-env-vars": "error",
    "import/prefer-default-export": "off",
    "no-console": "off",
    // Disable if it becomes really annoying
    // '@typescript-eslint/no-shadow': 'off',
    // As per https://stackoverflow.com/a/55863857/7365866
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: ["**/*.test.ts", "**/*.test.tsx"],
      },
    ],
  },
  ignorePatterns: ["*.gen.ts", "**/vite.config.ts", "**/.eslintrc.js"],
};
