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

  async function fetchChats() {
    if (status.value !== "idle") return;
    await execute();
    chats.value = chatsData.value;
  }

  async function createChat(
    options: { projectId?: string; title?: string } = {}
  ) {
    const id = (chats.value.length + 1).toString();
    const newChat = await $fetch<Chat>("/api/chats", {
      method: "POST",
      body: {
        id,
        title: options.title,
        messages: [],
        projectId: options.projectId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    chats.value.push(newChat);
    return newChat;
  }

  async function createChatAndNavigate(options: { projectId?: string } = {}) {
    const chat = await createChat(options);
    if (chat.projectId) {
      await navigateTo(`/projects/${chat.projectId}/chats/${chat.id}`);
    } else {
      await navigateTo(`/chats/${chat.id}`);
    }
  }

  function chatsInProject(projectId: string) {
    return chats.value.filter((chat) => chat.projectId === projectId);
  }

  return {
    chats,
    fetchChats,
    createChat,
    chatsInProject,
    createChatAndNavigate,
  };
}
