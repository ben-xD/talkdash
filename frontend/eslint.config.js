import sharedEslintConfig from "eslint-config-talkdash/web.eslint.config.js";
import tseslint from "typescript-eslint";

export default tseslint.config(...sharedEslintConfig, {
  languageOptions: {
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      project: [
        "./tsconfig.json",
        "./tsconfig.solid.json",
        "./tsconfig.node.json",
        "./tsconfig.test.json",
      ],
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {},
});
