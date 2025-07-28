## What is Nuxi?

[Nuxi](https://github.com/nuxt/cli) is Nuxt's CLI tool.

[The CLI Doc](https://nuxt.com/docs/4.x/api/commands/) is here.

## nuxt module

This command is an enhanced `npm install`.

Not only does it install a **node module** by package manager, but it also update `nuxt.config` file to make it a **nuxt module**, reducing many job for us.

Find the available modules [here](https://nuxt.com/modules).

It is normally used together with `npx` or `pnpx`(`pnpm dlx`) command.

For example, the eslint module **should be** installed by

```bash
pnpm dlx nuxi module add eslint
```
