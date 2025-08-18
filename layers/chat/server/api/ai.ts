import { ChatMessageSchema } from "../schemas";
import {
  createOllamaModel,
  generateChatResponse,
} from "../services/ai-services";

export default defineEventHandler(async (event) => {
  const { success, data } = await readValidatedBody(
    event,
    ChatMessageSchema.safeParse
  );

  if (!success) {
    return 400;
  }

  const { messages } = data as {
    messages: ChatMessage[];
    chatId: string;
  };

  const id = messages.length.toString();

  const ollamaModel = createOllamaModel();

  const response = await generateChatResponse(ollamaModel, messages);

  return {
    id,
    role: "assistant",
    content: response,
  };
});
