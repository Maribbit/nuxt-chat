<template>
  <ChatWindow :messages="messages" :chat="chat" @send-message="sendMessage" />
</template>

<script setup lang="ts">
  const { chat, messages, sendMessage } = useChat();

  useHead({
    title: chat.value.title,
  });
</script>
