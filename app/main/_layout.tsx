import "@/global.css";
import { useAuthStore } from "@/libs/store/authStore";
import { supabase } from "@/libs/superbase";
import { router, Stack } from "expo-router";
import { useEffect } from "react";

export default function MainLayout() {
  const { session, user } = useAuthStore();

  useEffect(() => {
    if (!session && !user) {
      router.replace("/(auth)/login");
    }

    console.log(user);

    supabase
      .from("users")
      .select("")
      .eq("id", user?.user_metadata?.sub)
      .single()
      .then((res) => {
        console.log(res);

        if (!res.data) {
          router.navigate("/onboarding");
        }
      });
  }, [session, user]);

  return (
    <Stack
      screenOptions={{ headerShown: false }}
      initialRouteName="(dashboard)" // 👈 start with the auth group
    />
  );
}
