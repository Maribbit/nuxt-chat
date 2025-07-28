## What is Nuxt UI

Nuxt UI is the official UI library of Nuxt.

It is built on [Reka UI](https://reka-ui.com/).

[Installation](https://ui.nuxt.com/getting-started/installation/nuxt) includes setup for `nuxt.config.ts`, [Tailwind CSS](https://tailwindcss.com/) and an [`App` component](https://ui.nuxt.com/components/app)

The option `shamefully-hoist=true` is required if we use `pnpm` as the package manager, mentioned in the documentation. We can set it in `.npmrc` to enable it by default.
