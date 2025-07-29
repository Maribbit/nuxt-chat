import {
  createOllamaModel,
  generateChatResponse,
} from "../services/ai-services";

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event);

  const id = messages.length.toString();

  const ollamaModel = createOllamaModel();

  const response = await generateChatResponse(ollamaModel, messages);

  return {
    id,
    role: "assistant",
    content: response,
  };
});
