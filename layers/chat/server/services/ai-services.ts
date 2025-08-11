import { generateText } from "ai";
import { createOllama } from "ollama-ai-provider";

import type { Message, LanguageModelV1 } from "ai";

export const createOllamaModel = () => {
  const ollama = createOllama();
  return ollama("gemma3");
};

export async function generateChatResponse(
  model: LanguageModelV1,
  messages: Message[]
) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("Messages must be a non-empty array");
  }

  const response = await generateText({
    model,
    messages,
  });

  return response.text.trim();
}
