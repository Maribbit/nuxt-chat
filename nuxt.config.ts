// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint"],
  css: ["./layers/base/app/assets/css/main.css"],
  vite: {
    optimizeDeps: {
      include: ["debug"],
    },
  },
  nitro: {
    storage: {
      db: {
        driver: "fs",
        base: "./.data",
      },
    },
  },

  $production: {
    nitro: {
      storage: {
        db: {
          driver: "netlify-blobs",
          name: "db",
        },
      },
    },
  },
});
