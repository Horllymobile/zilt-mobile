import * as Linking from "expo-linking";
import { Redirect, router } from "expo-router";
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
  return <Redirect href="/splash" />;
}
