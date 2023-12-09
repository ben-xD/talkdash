# Internal packages
 
- Remember to use `"type": "module"` in your `package.json`
- See https://turbo.build/repo/docs/handbook/sharing-code/internal-packages for more help.

To use the changes in other packages, you need to build this package. `pnpm build` of any package (or root) will do this. An existing dev server won't rebuild this package.