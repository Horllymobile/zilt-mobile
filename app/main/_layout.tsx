import { refreshAccessToken } from "@/libs/api/refresh";
import { useAuthStore } from "@/libs/store/authStore";
import { router, Stack } from "expo-router";
import { useEffect } from "react";

export default function MainLayout() {
  const { session, logout } = useAuthStore();

  useEffect(() => {
    if (!session || !session.refresh || !session.expiresIn) return;

    const refreshToken = async () => {
      try {
        const data = await refreshAccessToken(session.refresh);
        if (!data) {
          console.log("No new token — logging out");
          logout();
          router.dismissAll();
          router.replace("/(auth)/login");
        } else {
          console.log("Token refreshed successfully", data);
        }
      } catch (err) {
        console.error("Error refreshing token", err);
        logout();
        router.dismissAll();
        router.replace("/(auth)/login");
      }
    };

    const currentTime = Math.floor(Date.now() / 1000); // seconds
    const expiresAt = session.expiresAt; // timestamp in seconds

    // Immediate refresh if token is close to expiry (less than 1 minute left)
    if (expiresAt && expiresAt - currentTime < 60) {
      console.log("Token near expiry — refreshing now");
      refreshToken();
    }

    // Set up interval to refresh token proactively
    const refreshInterval = (session.expiresIn - 60) * 1000; // milliseconds
    const intervalId = setInterval(refreshToken, refreshInterval);

    return () => clearInterval(intervalId); // cleanup
  }, [session]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* The nested routes like (dashboard) will render here */}
      <Stack.Screen name="CropMoment" />
    </Stack>
  );
}
