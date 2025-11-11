import { useAuthStore } from "@/libs/store/authStore";
import * as Linking from "expo-linking";
import { Redirect, useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    const handleDeepLink = (event: Linking.EventType) => {
      const url = event.url;
      if (url.includes("reset-password")) {
        router.push("/(auth)/reset-password");
      }
    };

    const sub = Linking.addEventListener("url", handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url && url.includes("reset-password")) {
        router.push("/(auth)/reset-password");
      }
    });

    return () => sub.remove();
  }, []);

  const { session } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!session) return;

    const timer = setTimeout(() => {
      if (session) {
        router.replace("/main/(dashboard)");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [session]);
  return <Redirect href="/splash" />;
}
