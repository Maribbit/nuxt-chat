import {
  getMessagesByChatId,
  createMessageForChat,
} from "../../../../repository/chatRepository";
import {
  createOllamaModel,
  generateChatResponse,
} from "../../../../services/ai-services";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const history = await getMessagesByChatId(id);
  const ollamaModel = createOllamaModel();
  const reply = await generateChatResponse(ollamaModel, history);
  return createMessageForChat({
    chatId: id,
    content: reply,
    role: "assistant",
  });
});
