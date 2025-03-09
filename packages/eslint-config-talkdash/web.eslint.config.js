import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier";
import tseslintParser from "@typescript-eslint/parser";
import eslintTanstackQuery from "@tanstack/eslint-plugin-query";
import eslintTurboConfig from "eslint-config-turbo/flat";

export default tseslint.config(
    ...eslintTurboConfig,
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  // Not supported with tailwind v4
  // ...eslintTailwind.configs["flat/recommended"],
  ...eslintTanstackQuery.configs["flat/recommended"],
  // This needs to in a separate object to be a "global ignore". See https://github.com/eslint/eslint/discussions/17429
  { ignores: ["dist", "*.gen.ts", "dev-dist", "vite.config.ts.timestamp-*.mjs", "src/codegen"] },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parser: tseslintParser,
      // parserOptions is merged into project eslint.config.js files
      parserOptions: {
        // debugLevel: true,
        //  debugLevel: 'typescript',
        ecmaVersion: "latest",
        sourceType: "module",
        // No point setting these because they'll be wrong for specific projects:
        // project: [],
        // tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
        "@typescript-eslint/consistent-type-definitions": ["error", "type"],

        "turbo/no-undeclared-env-vars": "error",
        "import/prefer-default-export": "off",
        "no-console": "off",
      // Too much spam when we don't use variables when overriding methods in classes.
      // Also see https://www.totaltypescript.com/tsconfig-cheat-sheet
      "@typescript-eslint/no-unused-vars": "off",

      // // Prevent if (!value) causing bugs when value==0 is treated like value is not set.
      // // See https://stackoverflow.com/a/64995330/7365866 and https://stackoverflow.com/a/78267055/7365866
      // "@typescript-eslint/strict-boolean-expressions": "error",

      // Annoying error after creating a new component from templates
      "@typescript-eslint/no-empty-object-type": "off",

      eqeqeq: ["error", "always"],

      // Not supported with tailwind v4
      // // Inspired from https://www.themosaad.com/blog/two-years-of-tailwind-css
      // // Enforce typesafety for Tailwind CSS classnames
      // // https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/no-custom-classname.md
      // "tailwindcss/no-custom-classname": "error",

      // // Avoid contradicting Tailwind CSS classnames
      // // https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/no-contradicting-classname.md
      // "tailwindcss/no-contradicting-classname": "error",

      // // This rule slows down linting significantly, so we disable it. See https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/276 (it's closed but not fixed)
      // "tailwindcss/no-custom-classname": "off",

      // Disable this lint rule because it crashes eslint when linting an enum:
      // TypeError: Cannot read properties of undefined (reading 'members')
      "@typescript-eslint/no-duplicate-enum-values": "off",

      // Prevent @typescript-eslint/no-misused-promises errors in code like `<button onClick={onClick}>Copy</button>`
      // where onClick is an async function.
      "@typescript-eslint/no-misused-promises": [
        2,
        {
          checksVoidReturn: {
            attributes: false,
            properties: false,
            arguments: false,
          },
        },
      ],
    },
  },
);