## What is husky?

Husky is an npm module to add hooks to git's committing operation.

To [add it to our workflow](https://typicode.github.io/husky/get-started.html), we just use commands below.

```bash
pnpm add --save-dev husky
pnpm exec husky init
```

This creates a `.husky` folder in our project.

Edit `pre-commit` to setup hooks.
