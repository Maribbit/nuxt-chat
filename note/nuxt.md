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

## Shared Directory

[Shared Directory](https://nuxt.com/docs/4.x/guide/directory-structure/shared) is used to share code **between frontend (Vue App) and backend (Nitro server)**.

According to official doc, any direct child of `shared/types` and `shared/utils` can be auto-imported to other parts of our app. If it is not, we can try command `nuxi prepare`.

```bash
pnpm dlx nuxi prepare
```

Auto-import is optimum, but if something goes wrong, manual import still works well.

# Server Development

[Server Directory Doc](https://nuxt.com/docs/4.x/guide/directory-structure/server)

```
-| server/
---| api/
-----| chats/
-------| index.get.ts	# GET /api/chats/
-------| index.post.ts	# POST /api/chats/
-------| [id]/
---------| messages/
-----------| generate.post.ts	# POST /api/chats/:id/messages/generate
---| routes/
-----| bonjour.ts    # /bonjour
---| middleware/
-----| log.ts        # log all requests
```

## Server Routes

Each hander defined in `api/` and `routes` generates a **server route** in Nuxt.

## Matching HTTP Method

It refers to file names suffixed with `.get`, `.post`, `.put`, `.delete`, ...

Here are several benefits to use this name convention.

- **Dev Tool Support**: we can see their difference and test easily in "Server Routes" Tabs.
- **Split Logic**: otherwise the handler might become more complex.

## Passing Parameters

Event handlers use methods provided by [h3](#h3) to handle requests.

```typescript
export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);	// get parameter from route
  const { content, role } = await readBody(event); // parse HTTP body

  return createMessageForChat({
    chatId: id,
    content,
    role,
  });
});
```

## Middleware

Define a handler in `/server/middleware`, and it will run **before any server route**.

These middleware are called **server middleware** (aka Nitro middleware) .

However, this approach should be taken carefully because it might confuse logic flow and make our routes slower. Checkout [this blog](https://masteringnuxt.com/blog/server-middleware-is-an-anti-pattern-in-nuxt) to help understand.

```typescript
export default defineEventHandler(async (event) => {
  const storage = useStorage("db");
  await storage.setItem(`telemetry:request:${Date.now()}`, {
    url: getRequestURL(event),
    method: event.method,
    headers: getRequestHeaders(event),
  });
});
```

## Cache Response

This is an easy way to optimize API performance: we cache the response of an API and directly respond with it for a time range, without running any code.

This can be achieved with `defineCachedEventHandler` provided by [Nitro Cache](https://nitro.build/guide/cache).

By default, in development, the cached responses are stored in `.nuxt/cache/nitro/handlers`.

```typescript
// The response of this handler will be the same in every 20 seconds.
export default defineCachedEventHandler(
  async (_event) => {
    console.log("Fetching all chats...");
    const storage = useStorage("db");
    await storage.setItem("chats:has-new-chat", false);
    return getAllChats();
  },
  {
    name: "getAllChats",
    maxAge: 20,
  }
);
```

A more practical usage is to set a flag which indicates whether the endpoint should be refreshed.

```typescript
export default defineCachedEventHandler(
  async (_event) => {
    console.log("Fetching all chats...");
    const storage = useStorage("db");
    await storage.setItem("chats:has-new-chat", false);
    return getAllChats();
  },
  {
    name: "getAllChats",
    maxAge: 0,
    swr: false,		// default to be true
    async shouldInvalidateCache() {
      const storage = useStorage("db");
      const hasNewChat = await storage.getItem<boolean>("chats:has-new-chat");
      return hasNewChat || false;
    },
  }
);
```

The option `swr` stands for `stale-while-revalidate`.

It answers the question: shall we wait the function `shouldInvalidateCache` to return before serving the cache?

It is set to `true` by default to maximize efficiency, which means `shouldInvalidateCache` does not block the response.

# Data Fetching

[Data Fetching Official Guide](https://nuxt.com/docs/4.x/getting-started/data-fetching)

There are three methods in Nuxt to fetch data:

1. `$fetch`: a simple caller, suitable for **sending data** to backend.
2. `useAsyncData`: a function to be called in SSR to **get data** in `setup()` hook.
3. `useFetch`: a wrapper of `useAsyncData` and `$fetch` to simplify SSR data getting.

## Setup Stage

In Nuxt, because of SSR, we can fetch many data and render them on server, before sending the component to user.

`$fetch` is not enough because it is just a backend caller, which can be called anywhere, even outside the `setup` function. If we use it in `setup` block carelessly, by default it will be called twice: once during SSR, once in the browser.

To enable this feature correctly, we shall use the hook[ `useAsyncData`](https://nuxt.com/docs/4.x/api/composables/use-async-data). Here is a simple composable which has a global state `chats` and exposes a `fetchChats` method to fetch initial data when needed.

```typescript
export default function useChats() {
  const chats = useState<Chat[]>("chats", () => []);
  const {
    data: chatsData,
    execute,	// With immediate: false below, it is meaningful
    status,
  } = useAsyncData<Chat[]>(
    "chats",
    () => {
      return $fetch<Chat[]>("/api/chats");
    },
    {
      immediate: false,	// Do not fetch immediately when useChats() is called
      default: () => [],
    }
  );

  async function fetchChats() {
    if (status.value !== "idle") return;
    await execute();
    chats.value = chatsData.value;
  }
    
  return {
    chats,
    fetchChats,		// It should be called only once in a component's setup.
    };
}
```

[`useFetch`](https://nuxt.com/docs/4.x/api/composables/use-fetch) is a thin wrapper of  `useAsyncData` and `$fetch`. The following setup has exactly the same effect as above.

```typescript
export default function useChats() {
  const chats = useState<Chat[]>("chats", () => []);
  const {
    data: chatsData,
    execute,
    status,
  } = useFetch<Chat[]>("/api/chats", {
    immediate: false,
    default: () => [],
  });
    
  // ...
}
```

# Persistent

## key-value

Follow the [official guide](https://nuxt.com/docs/4.x/guide/directory-structure/server#server-storage). We can setup [unstorage](#unstorage) in Nitro to access databases with `useStorage` composable.

```typescript
/* nuxt.config.ts */
export default defineNuxtConfig({
  //...
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

/* example usage */
const storage = useStorage<Chat[]>("db");
const chatsKey = "chats:all";
async function getChats(): Promise<Chat[]> {
  let chats = await storage.getItem(chatsKey);

  // Initialize with mock data
  if (chats === null) {
    chats = [MOCK_CHAT];
    await saveChats(chats);
  }

  return chats;
}

async function saveChats(chats: Chat[]): Promise<void> {
  await storage.setItem(chatsKey, chats);
}

```

# UnJS

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

## unstorage

[unstorage](https://unstorage.unjs.io/) is a key-value storage library features many different [drivers](https://unstorage.unjs.io/drivers) (Node fs, MongoDB, Netlify Blobs, ...).

We can even create [custom drivers](https://unstorage.unjs.io/guide/custom-driver) based on its framework.

# Configuration

The [official configuration doc](https://nuxt.com/docs/4.x/api/nuxt-config) is really long.

## [`runtimeConfig`](https://nuxt.com/docs/4.x/api/nuxt-config#runtimeconfig-1)

Useful for dynamic config or environment variables, either server-only or client-only(`public`).

## [`app.config.ts`](https://nuxt.com/docs/4.x/guide/directory-structure/app/app-config)

This is **reactive**, and **global**, meaning that it is always exposed to client side.

| compare       | `runtimeConfig`                         | `app.config.ts`                             |
| ------------- | --------------------------------------- | ------------------------------------------- |
| How is it set | Set at runtime externally               | Set at build time                           |
| Sensitive?    | Secrets and sensitive information       | **NO** sensitive information                |
| Data Type     | Only strings                            | Any TypeScript                              |
| Changable?    | Can **NOT** change while app is running | Can be updated per request                  |
| Usecase       | URLs(DB, Auth), secrets                 | theme, feature toggles, other app meta-data |
