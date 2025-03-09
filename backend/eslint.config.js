import eslint from "@eslint/js";
import tseslintParser from "@typescript-eslint/parser";
import eslintPluginPrettier from "eslint-plugin-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  // This needs to in a separate object to be a "global ignore". See https://github.com/eslint/eslint/discussions/17429
  {
    ignores: [
      "dist",
      "*.gen.ts",
      "vite.config.ts.timestamp-*.mjs",
      "src/codegen",
      "eslint.config.js",
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parser: tseslintParser,
      parserOptions: {
        // debugLevel: true,
        // debugLevel: 'typescript',
        ecmaVersion: "latest",
        sourceType: "module",
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
    settings: {},
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],

      // TODO enable the following
      // // Prevent if (!value) causing bugs when value==0 is treated like value is not set.
      // // See https://stackoverflow.com/a/64995330/7365866 and https://stackoverflow.com/a/78267055/7365866
      // "@typescript-eslint/strict-boolean-expressions": "error",

      eqeqeq: ["error", "always"],
    },
  },
);
