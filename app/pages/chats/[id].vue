<template>
  <ChatWindow
    :messages="messages"
    :chat="chat"
    :typing="typing"
    @send-message="handleSendMessage"
  />
</template>

<script setup lang="ts">
  const route = useRoute();
  const { chat, messages, sendMessage } = useChat(route.params.id as string);

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
