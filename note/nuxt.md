# **UnJS**

Many essential composables and API in Nuxt are built on [UnJS](https://unjs.io/packages?q=&order=1&orderBy=title) ecosystem.

## Unhead

[Unhead](https://unhead.unjs.io/), a JS library initially built for Vue and Nuxt to control things outside the app entry.

### `useHead` and `useHeadSafe`

[`useHeadSafe`](https://nuxt.com/docs/4.x/api/composables/use-head-safe) can prevent potential code injection like setting innerHTML.

## **h3**

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
