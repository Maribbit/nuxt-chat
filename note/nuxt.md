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

The same component is rendered both in server and in browser, which causes `ref` initialization to run twice in different environment.

With `useState`, the state is initialized only once and transferred to the browser.

What's more, `useState` defines a **global** state, meaning that if the same code above is copied to another component, `stateTest` still logs the same value.

Which means that it can **replace Pinia** most of the time.

## Tips for State Management

In Vue, we often use Composables to store **stateful logic**, and then define CRUD to those states.

In Nuxt, it is similar except that the **creation** method should be carefully chosen.

Also, when the states are **nested deeper** and **asynchronous** operations are added, things can get messy.

The following code is a nested state management pattern in an AI chat APP.

```typescript
/*
Composable best practice in Nuxt
"Chats" contains 0 or more "Chat"
*/
export default function useChats() {
    // --Create Chats--
    const chats = useState<Chat[]>("chats", () => [INIT_DATA]);
    // --Read Chats--
    function chatsInProject(projectId: string) {
        return chats.value.filter(() => {/*...*/})
    }
    // --Update Chats--
    function createChat(options: { projectId?: string } ) {
        const id = generateNewId();
        chats.value.push(() => {/*...*/})
        return id;
    }
    // expose states and methods
    return {
        chats,
        createChat,
        chatsInProject
    }
}

export default function useChat(chatId: string) {
    // --Create Chat and Messages--
    const { chats } = useChats();
    const chat = computed(() => chats.value.find(c => c.id === chatId))
    const messages = computed<ChatMessage[]>(() => chat.value?.messages || [])
    // --Update Messages Syncronously--
    function createMessage(message: string, role ChatMessage["role"]) {
        const id = generateNewId();
        return {id, role, content: message}
    }
    // --Update Messages Asynchronously--
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
