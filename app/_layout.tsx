import "@/global.css";
import { useAuthStore } from "@/libs/store/authStore";
import { Stack, useRouter, useSegments } from "expo-router";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments(); // useful to check current route
  const { session, user } = useAuthStore();

  // ✅ Always render the navigation tree
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="main" />
      <Stack.Screen name="splash" />
    </Stack>
  );
}
