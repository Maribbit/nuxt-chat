import { getAllChats } from "../../repository/chatRepository";

export default defineCachedEventHandler(
  async (_event) => {
    console.log("Fetching all chats...");
    const storage = useStorage("db");
    await storage.setItem("chats:has-new-chat", false);
    return getAllChats();
  },
  {
    name: "getAllChats",
    maxAge: 0,
    swr: false,
    async shouldInvalidateCache() {
      const storage = useStorage("db");
      const hasNewChat = await storage.getItem<boolean>("chats:has-new-chat");
      return hasNewChat || false;
    },
  }
);
