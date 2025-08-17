import { updateChat } from "../../../repository/chatRepository";
import {
  createOllamaModel,
  generateChatTitle,
} from "../../../services/ai-services";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const { message } = await readBody(event);

  const model = createOllamaModel();
  const title = await generateChatTitle(model, message);

  const storage = useStorage("db");
  await storage.setItem(`chats:has-new-chat`, true);

  return updateChat(id, { title });
});
