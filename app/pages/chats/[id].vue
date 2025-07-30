<template>
  <ChatWindow
    :messages="messages"
    :chat="chat"
    :typing="typing"
    @send-message="handleSendMessage"
  />
</template>

<script setup lang="ts">
  const { chat, messages, sendMessage } = useChat();

  const typing = ref(false);

  const handleSendMessage = async (message: string) => {
    typing.value = true;
    await sendMessage(message);
    typing.value = false;
  };

  useHead({
    title: chat.value.title,
  });
</script>
