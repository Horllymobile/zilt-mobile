import { BASE_URL } from "@/shared/constants/endpoints";

export const chatsEndpoints = {
  getChats: {
    url: `${BASE_URL}/chats`,
    method: "get",
  },
  createChat: {
    url: `${BASE_URL}/chats`,
    method: "post",
  },
  getChat: (chatId?: string) => ({
    url: `${BASE_URL}/chats/${chatId}`,
    method: "get",
  }),
};
