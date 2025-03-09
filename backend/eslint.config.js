import sharedEslintConfig from "eslint-config-talkdash/node.eslint.config.js";
import tseslint from "typescript-eslint";

export default tseslint.config(...sharedEslintConfig, {
  languageOptions: {
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      project: ["./tsconfig.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {},
});
