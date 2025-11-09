"use client";
import "@/assets/styles/global.css";
import { THEME } from "@/shared/constants/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { Suspense } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Providers } from "../shared/providers";

const queryClient = new QueryClient();
export default function RootLayout() {
  return (
    <PaperProvider theme={THEME}>
      <Suspense>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <Providers>
              <Stack
                screenOptions={{ headerShown: false }}
                initialRouteName="splash"
              >
                <Stack.Screen name="main" />
                <Stack.Screen name="splash" />
              </Stack>
            </Providers>
          </QueryClientProvider>
        </SafeAreaProvider>
      </Suspense>
    </PaperProvider>
  );
}
