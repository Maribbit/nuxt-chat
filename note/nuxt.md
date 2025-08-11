# File Based Routing

Just add a `<NuxtPage />` component in the App, then Nuxt will read the `/pages` folder to generate routes from it.

## Nested Routes

The following structure is a typical nested route.

- `/projects/` only renders`[projectId].vue` because Nuxt **prefers files over folders**.
- If there is a `<NuxtPage />` component nested in `[projectId].vue`,
  - `/projects/1/chats/1` will render `[projectId].vue` with deepest `[id].vue` nested.

```
-| pages
---| chats
------| [id].vue
---| projects
------| [projectId].vue
------| [projectId]
---------| index.vue
---------| chats
------------|[id].vue
```

# State Management

Start with `useState`, we can create in-memory states inside browser. They are reset if the page is refreshed. 

## `useState`

We can see its detail in [State Management guide](https://nuxt.com/docs/4.x/getting-started/state-management#best-practices) and [useState API doc](https://nuxt.com/docs/4.x/api/composables/use-state).

SSR causes some issue when using `ref()`. For example if we define these two states in a single component, we will see **4 logs**, two from the server and two inside the browser.

```typescript
const stateTest = useState("random", Math.random);
const refTest = ref(Math.random());
console.log("State Test:", stateTest.value); // these two are identical
console.log("Ref Test:", refTest.value); // these two are different
```

The same component is rendered both in server and in browser, which causes `ref` initialization to run twice in different environment.

With `useState`, the state is initialized only once and transferred to the browser.

What's more, `useState` defines a **global** state, meaning that if the same code above is copied to another component, `stateTest` still logs the same value.

Which means that it can **replace Pinia** most of the time.

## State Management in Practice

In Vue, we use Composables to encapsulate **stateful logic**, and define CRUD methods for those states.

When using Pinia or Nuxt, the **Creation** methods are often replaced by **Registration** to the framework.

When the states are **nested deeper** and **asynchronous** operations are added, things can get messy.

The following code is an organized nested state management pattern in an AI chat APP.

```typescript
/*
Composable best practice in Nuxt
"Project" contains 0 or more "Chats"
"Chats" contains 0 or more "Chat"
Notice how these nested lists and objects are separated to smaller composables:
A combination of Dependency Injection (ID as parameter) and Normalization (projectId)
*/
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  projectId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
}
// `useProjects.ts`
export default function useProjects() {
    // --Register Project Store--
    const projects = useState<Project[]>("projects", () => [MOCK_PROJECT]);
    // --Update Store--
    function createProject() { 
        const id = generateNewId();
        projects.value.push({/*...*/})
        return project;
    };
    return { projects, createProject }
}
// `useProject.ts`
export default function useProject(projectId: sring) {
    // --Inject a single Project from Project Store--
    const { projects } = useProjects();
    const project = computed(() => projects.value.find((p) => p.id === projectId))
    // --Update Store Deeply--
    function updateProject(updatedProject: Partial<Project>) {
        /*...*/
    }
    retrurn { project, updateProject }
}
// `useChats.ts`
export default function useChats() {
    // --Register Chat Store--
    const chats = useState<Chat[]>("chats", () => [INIT_DATA]);
    // --Update Store--
    function createChat(options: { projectId?: string } ) {
        const id = generateNewId();
        chats.value.push(() => {/*...*/})
        return id;
    }
    // --Read from Store--
    function chatsInProject(projectId: string) {
        return chats.value.filter(() => {/*...*/})
    }
    return { chats, createChat, chatsInProject }
}
// `useChat.ts`
export default function useChat(chatId: string) {
    // --Inject a single Chat from Chat Store--
    const { chats } = useChats();
    const chat = computed(() => chats.value.find(c => c.id === chatId))
    const messages = computed<ChatMessage[]>(() => chat.value?.messages || [])
    // --Update Store Synchronously--
    function createMessage(message: string, role ChatMessage["role"]) {
        const id = generateNewId();
        return {id, role, content: message}
    }
    // --Update Store Asynchronously--
    async function sendMessage(message: string) {
        if (!chat.value) return;
        messages.value.push(createMessage(message, "user"))
        const data = await $fetch<ChatMessage>("/api/ai", {
            method: "POST", body: {messages: messages.value}
        })
        messages.value.push(data)
    }
    return {
        chats,
        messages,
        sendMessage
    }
}
```

# Client-Side Navigation

## `navigateTo`

[`navigateTo() Doc`](https://nuxt.com/docs/4.x/api/utils/navigate-to)

```typescript
await navigateTo('https://nuxt.com', {
  external: true
})
```

This is an **Asynchronous** method built on Vue Router, providing easy client-side navigation.

It takes two parameters: `to` and `options`.

## Common Pitfall: No Such Page

```typescript
await navigateTo(`/chats/${id}`);
```

When we are navigating between pages with parameters, there is a common pitfall:

**What if the page doesn't exists?**

A simple approach is to redirect the user to another page, with `{replace: true}` to prevent user from going back to the wrong page.

```typescript
if (!chatFromChats.value) {
    navigateTo("/", { replace: true });
  }
```

## `<NuxtLink>`

[NuxtLink doc](https://nuxt.com/docs/4.x/api/components/nuxt-link#nuxtlink)

Anywhere we want an anchor tag `<a/>` to be a client-side navigation, we should replace it with `<NuxtLink/>`, a wrapped Vue Router's `<RouterLink/>`.

```vue
<template>
  <NuxtLink
    v-for="chat in chats"
    :key="chat.id"
    :to="`/chats/${chat.id}`"
    active-class="text-(--ui-text-primary) bg-(--ui-bg-elevated)"
  >
    {{ chat.title || "Untitled Chat" }}
  </NuxtLink>
</template>
```

## Vue Router

As a reminder, [**Vue Router**](https://router.vuejs.org/) listens for changes in browser's URL. When the URL changes, it finds the matching route in its configuration and renders the corresponding component.

Also, it leverages the browser's `history.pushState()` and `history.replaceState()` methods to modify the URL without triggering a refresh.

# Code Organization

## Layers

[Layer](https://nuxt.com/docs/4.x/getting-started/layers) is the official way to split a bigger Nuxt APP to many smaller ones, making each of them an independent part to be shared through GitHub, NPM, etc.

[This doc](https://nuxt.com/docs/4.x/guide/going-further/layers) gives us more information about it.

This is the most advanced feature in Nuxt frontend development. Its complexity is acceptable only if we are building a really complex frontend.

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
