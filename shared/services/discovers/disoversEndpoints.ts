import { BASE_URL } from "@/shared/constants/endpoints";

export const discoversEndpoints = {
  findPeople: () => {
    return {
      url: `${BASE_URL}/discovers/people`,
      method: "get",
    };
  },
  findMoments: () => {
    return {
      url: `${BASE_URL}/discovers/moments`,
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
