# Core Composables

These are unique composables defined in Nuxt JS.

## `useState`

We can see its detail in [State Management guide](https://nuxt.com/docs/4.x/getting-started/state-management#best-practices) and [useState API doc](https://nuxt.com/docs/4.x/api/composables/use-state).

SSR causes some issue when using `ref()`. For example if we define these two states in a single component, we will see **4 logs**, two from the server and two inside the browser.

```typescript
const stateTest = useState("random", Math.random);
const refTest = ref(Math.random());
console.log("State Test:", stateTest.value); // these two are identical
console.log("Ref Test:", refTest.value); // these two are different
```

The same component is rendered both in server and in browser, which causes `ref` initialization run twice in different environment.

With `useState`, the state is initialized only once and transferred to the browser.

What's more, `useState` defines a **global** state, meaning that if the same code above is copied to another component, `stateTest` still logs the same value.

Which means that it can **replace Pinia** most of the time.

# **UnJS**

Many essential composables and API in Nuxt are forming [UnJS](https://unjs.io/packages?q=&order=1&orderBy=title) ecosystem.

## Unhead

[Unhead](https://unhead.unjs.io/), a JS library initially built for Vue and Nuxt to control things outside the app entry.

### `useHead` and `useHeadSafe`

[`useHeadSafe`](https://nuxt.com/docs/4.x/api/composables/use-head-safe) can prevent potential code injection like setting innerHTML.

## h3

[h3JS](https://github.com/h3js) is a collection of HTTP tools.

[h3](https://v1.h3.dev/) is an HTTP server framework just like Express.js, but with a "Composable" API (`createApp`, `app.use()`). It is based on other tools in h3JS library.

### `defineEventHandler`

This is used in Nuxt's `server/` directory to define request handlers.

Refer to [h3 Event Handler](https://v1.h3.dev/guide/event-handler) document for more detail.

Specifically, it let us read the [Event Object](https://v1.h3.dev/guide/event) and return [some types of response](https://v1.h3.dev/guide/event-handler#responses-types).

Commonly used types:

- JSON serializable value
- `null` as `204 - No Content`: useful when deleting or updating something.

### `readBody`, `readValidatedBody`

They are **async** functions applied to the `Event` object to parse its body.

It involves another UnJS library [destr](https://github.com/unjs/destr), a secure and convenient alternative for `JSON.parse()`

We can find them and many other functions for `Event` in [h3 Request](https://v1.h3.dev/utils/request#readbodyevent-options-strict).

## ofetch

This is what behind `$fetch` in Nuxt JS.

# Configuration

The [official configuration doc](https://nuxt.com/docs/4.x/api/nuxt-config) is really long.

## [runtimeConfig](https://nuxt.com/docs/4.x/api/nuxt-config#runtimeconfig-1)

Useful for dynamic config or environment variables, either server-only or client-only(`public`).

## [app.config.ts](https://nuxt.com/docs/4.x/guide/directory-structure/app/app-config)

This is **reactive**, and **global**, meaning that it is always exposed to client side.

| compare       | `runtimeConfig`                         | `app.config.ts`                             |
| ------------- | --------------------------------------- | ------------------------------------------- |
| How is it set | Set at runtime externally               | Set at build time                           |
| Sensitive?    | Secrets and sensitive information       | **NO** sensitive information                |
| Data Type     | Only strings                            | Any TypeScript                              |
| Changable?    | Can **NOT** change while app is running | Can be updated per request                  |
| Usecase       | URLs(DB, Auth), secrets                 | theme, feature toggles, other app meta-data |
