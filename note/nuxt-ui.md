## What is Nuxt UI?

Nuxt UI is the official UI library of Nuxt.

It is built on [Reka UI](https://reka-ui.com/).

[Installation](https://ui.nuxt.com/getting-started/installation/nuxt) includes setup for `nuxt.config.ts`, [Tailwind CSS](https://tailwindcss.com/) and an [`App` component](https://ui.nuxt.com/components/app)

The option `shamefully-hoist=true` is required if we use `pnpm` as the package manager, mentioned in the documentation. We can set it in `.npmrc` to enable it by default.

## Customize Theme

[Nuxt UI Theme](https://ui.nuxt.com/getting-started/theme): Official guide

[Tailwind CSS Theme Configuration](https://tailwindcss.com/docs/theme): How to control `main.css` global theme

```css
@import "tailwindcss";
@import "@nuxt/ui";

@theme {
  --font-sans: Inter, system-ui, sans-serif;
}

:root {
  --ui-primary: var(--color-green-500);
}
```

[Nuxt App Configuration](https://nuxt.com/docs/api/configuration/nuxt-config): Customize themes of components in `app.config.ts`, for example, the buttons

```typescript
export default defineAppConfig({
  title: "AI Chat",
  ui: {
    button: {
      slots: {
        base: "font-bold cursor-pointer",
      },
    },
  },
});

```

