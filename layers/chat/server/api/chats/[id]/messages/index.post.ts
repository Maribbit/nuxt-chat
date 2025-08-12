import { createMessageForChat } from "~~/layers/chat/server/repository/chatRepository";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const { content, role } = await readBody(event);

  return createMessageForChat({
    chatId: id,
    content,
    role,
  });
});
