module.exports = {
  root: true,
  extends: ['eslint-config-talkdash', 'plugin:solid/recommended'],
  parserOptions: {
    project: ['tsconfig.json'],
    tsconfigRootDir: __dirname
  }
}
