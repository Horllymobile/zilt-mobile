// store.ts
import { ILocalChat } from "@/models/local-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ChatState = {
  refetch?: boolean | null;
  fetching: boolean;
  chats?: ILocalChat[];
  setChatData: (data: Omit<ChatState, "setChatData">) => void;
};

export const useChatStore = create(
  persist<ChatState>(
    (set) => ({
      refetch: false,
      fetching: false,
      chats: [],
      setChatData: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),
    }),
    {
      name: "chat",
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);

export const selectChat = (state: ChatState) => ({
  chats: state.chats,
  refetch: state.refetch,
  fetching: state.fetching,
  setChatData: state.setChatData,
});
