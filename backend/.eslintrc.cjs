module.exports = {
  root: true,
  extends: ["eslint-config-talkdash"],
  parserOptions: {
    project: ["tsconfig.lint.json"],
    tsconfigRootDir: __dirname,
  },
};
