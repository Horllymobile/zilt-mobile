import "@/global.css";
import { refreshAccessToken } from "@/libs/api/refresh";
import { useAuthStore } from "@/libs/store/authStore";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function MainLayout() {
  const { session } = useAuthStore();

  useEffect(() => {
    if (!session) return;

    const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
    const expiresAt = session.expiresAt; // e.g., 1730678367 (timestamp in seconds)

    const isExpired = expiresAt && expiresAt < currentTime;

    if (isExpired && session.refresh) {
      console.log("Session expired — logging out user...");
      refreshAccessToken(session.refresh).then(() => {});
    }
  }, [session]);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* The nested routes like (dashboard) will render here */}
      <Stack.Screen name="CropMoment" />
    </Stack>
  );
}
