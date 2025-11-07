"use client";
import { useAuthStore } from "@/libs/store/authStore";
import { Redirect, Stack } from "expo-router";
import "../global.css";

export default function AuthLayout() {
  const { session, profile } = useAuthStore();

  // ✅ handle redirect in render
  if (session || profile) {
    return <Redirect href="/main/dashboard" />;
  }
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="login">
      <Stack.Screen name="login" />
      <Stack.Screen name="verify" />
    </Stack>
  );
}
