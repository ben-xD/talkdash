module.exports = {
  root: true,
  extends: ['eslint-config-talkdash'],
  parserOptions: {
    project: ['tsconfig.json'],
    tsconfigRootDir: __dirname
  }
}
