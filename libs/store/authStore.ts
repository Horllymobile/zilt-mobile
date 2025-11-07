// store.ts
import { Profile, Session } from "@/models/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  session?: Session | undefined;
  profile?: Profile | undefined;

  setAuthData: (data: Omit<AuthState, "setAuthData" | "logout">) => void;
  logout: () => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      session: undefined,
      user: undefined,
      setAuthData: (data: Omit<AuthState, "setAuthData" | "logout">) =>
        set(data),
      logout() {
        set({
          session: undefined,
          profile: undefined,
        });
      },
    }),
    {
      name: "auth", // storage key
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
  profile: state.profile,
  setAuthData: state.setAuthData,
});
