export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event);

  const id = messages.length.toString();
  const lastMessage = messages[messages.length - 1];

  return {
    id,
    role: "assistant",
    content: `You sent: ${lastMessage.content}. This is a mock response.`,
  };
});
