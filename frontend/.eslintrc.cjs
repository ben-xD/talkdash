module.exports = {
  root: true,
  extends: ['eslint-config-talkdash', 'plugin:solid/recommended', "plugin:tailwindcss/recommended", "plugin:@tanstack/eslint-plugin-query/recommended"],
  parserOptions: {
    project: ['tsconfig.json'],
    tsconfigRootDir: __dirname
  },
  rules: {
    // Inspired from https://www.themosaad.com/blog/two-years-of-tailwind-css
    // Enforce typesafety for Tailwind CSS classnames
    // https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/no-custom-classname.md
    "tailwindcss/no-custom-classname": "error",

    // Avoid contradicting Tailwind CSS classnames
    // https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/no-contradicting-classname.md
    "tailwindcss/no-contradicting-classname": "error",
  }
}
