import { axiosBaseQuery } from "@/libs/api/request";
import { Chat } from "@/models/chat";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { chatsEndpoints } from "./chatsEndpoints";

export const useGetChatsQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const resp = await axiosBaseQuery(chatsEndpoints.getChats);
      console.log(resp);
      return resp.data || [];
    },
    enabled,
  });
};

export const useGetChatQuery = (enabled: boolean, chatId?: string) => {
  return useQuery({
    queryKey: ["chat"],
    queryFn: async () => {
      const resp = await axiosBaseQuery(chatsEndpoints.getChat(chatId));
      console.log(resp);
      return resp.data as Chat;
    },
    enabled: !!chatId && enabled,
  });
};

export interface ChatDto {
  senderId: string;
  recipientId: string;
  content: string;
  media?: string[];
}

export const useCreateChatMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ChatDto) =>
      axiosBaseQuery({ ...chatsEndpoints.createChat, data }),
    onError: (error: any) => {
      console.log(error);
      // Alert.alert(formatErrorMessage(error));
    },
  });
};
