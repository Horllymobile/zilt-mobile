import "@/global.css";
import { useAuthStore } from "@/libs/store/authStore";
import { supabase } from "@/libs/superbase";
import { User } from "@supabase/supabase-js";
import { Redirect, router, Stack } from "expo-router";
import { useEffect } from "react";

export default function MainLayout() {
  const { session, user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchUserData(user);
    }
  }, [user]);

  // ✅ async function stays outside render
  const fetchUserData = async (user: User) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      if (!data) {
        // No user profile → onboard
        router.replace("/onboarding");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  // ✅ handle redirect in render
  if (!session || !user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* The nested routes like (dashboard) will render here */}
    </Stack>
  );
}
