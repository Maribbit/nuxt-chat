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

export async function generateChatTitle(
  model: LanguageModelV1,
  firstMessage: string
): Promise<string> {
  const response = await generateText({
    model,
    prompt: `You are a helpful assistant that generates concise, descriptive title for chat conversations. Generate a title that captures the essence of the first message in 3 short words or less: ${firstMessage}`,
  });
  return response.text.trim();
}
