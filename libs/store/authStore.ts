// store.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  session?: Session | null;
  user?: User | null;

  setAuthData: (data: Omit<AuthState, "setAuthData" | "logout">) => void;
  logout: () => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      session: null,
      user: null,
      setAuthData: (data: Omit<AuthState, "setAuthData" | "logout">) =>
        set(data),
      logout() {
        set({
          session: null,
          user: null,
        });
      },
    }),
    {
      name: "auth-storage", // storage key
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

export const selectAuth = (state: AuthState) => ({
  session: state.session,
  user: state.user,
  setAuthData: state.setAuthData,
});
