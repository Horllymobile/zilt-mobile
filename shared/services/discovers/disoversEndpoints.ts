import { BASE_URL } from "@/shared/constants/endpoints";
// import query from "qs";

export const discoversEndpoints = {
  findPeople: () => {
    return {
      url: `${BASE_URL}/discovers/people`,
      method: "get",
    };
  },

  //   createChat: {
  //     url: `${BASE_URL}/chats`,
  //     method: "post",
  //   },
  //   getChat: (chatId?: string) => ({
  //     url: `${BASE_URL}/chats/${chatId}`,
  //     method: "get",
  //   }),
};
