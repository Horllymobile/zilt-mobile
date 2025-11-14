// store.ts
import { ILocalMessage } from "@/models/local-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type MesageState = {
  chat?: any;
  chatId?: string;
  refetch?: boolean | null;
  fetching: boolean;
  messages?: ILocalMessage[];
  setMessageData: (data: Omit<MesageState, "setMessageData">) => void;
};

export const useMessageStore = create(
  persist<MesageState>(
    (set) => ({
      chat: undefined,
      refetch: false,
      fetching: false,
      messages: undefined,
      setMessageData: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),
    }),
    {
      name: "messages",
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

export const selectChat = (state: MesageState) => ({
  chatId: state.chatId,
  chat: state.chat,
  refetch: state.refetch,
  fetching: state.fetching,
  setChatData: state.setMessageData,
});
