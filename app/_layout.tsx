import "@/global.css";
import { useAuthStore } from "@/libs/store/authStore";
import { Stack } from "expo-router";

export default function RootLayout() {
  const { session, user } = useAuthStore();
  return (
    <Stack
      screenOptions={{ headerShown: false }}
      initialRouteName={session && user ? "main" : "splash"} // 👈 start with the auth group
    />
  );
}
