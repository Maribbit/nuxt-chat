<template>
  <ChatWindow
    :messages="messages"
    :chat="chat"
    :typing="typing"
    @send-message="handleSendMessage"
  />
</template>

<script setup lang="ts">
  import type { Chat } from "~/types";
  const route = useRoute();
  const {
    chat: chatFromChats,
    messages,
    sendMessage,
  } = useChat(route.params.id as string);

  if (!chatFromChats.value) {
    navigateTo("/", { replace: true });
  }

  const chat = computed(() => chatFromChats.value as Chat);

  const typing = ref(false);

  const handleSendMessage = async (message: string) => {
    typing.value = true;
    await sendMessage(message);
    typing.value = false;
  };

  useHead({
    title: chat.value?.title,
  });
</script>
