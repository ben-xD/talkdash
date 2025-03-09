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

// // Avoid eslint error: 'solid-devtools' should be listed in the project's dependencies, not devDependencies  import/no-extraneous-dependencies
// "import/no-extraneous-dependencies": ["error", { devDependencies: true }],

//     // Inspired from https://www.themosaad.com/blog/two-years-of-tailwind-css
// // Enforce typesafety for Tailwind CSS classnames
// // https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/no-custom-classname.md
// "tailwindcss/no-custom-classname": "error",

// // Avoid contradicting Tailwind CSS classnames
// // https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/no-contradicting-classname.md
// "tailwindcss/no-contradicting-classname": "error",
