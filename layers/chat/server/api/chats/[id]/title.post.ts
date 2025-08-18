import { updateChat } from "../../../repository/chatRepository";
import { UpdateChatTitleSchema } from "../../../schemas";
import {
  createOllamaModel,
  generateChatTitle,
} from "../../../services/ai-services";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const { success, data } = await readValidatedBody(
    event,
    UpdateChatTitleSchema.safeParse
  );

  if (!success) {
    return 400;
  }

  const model = createOllamaModel();
  const title = await generateChatTitle(model, data.message);

  const storage = useStorage("db");
  await storage.setItem(`chats:has-new-chat`, true);

  return updateChat(id, { title });
});
