"use client";
import "@/assets/styles/global.css";
import db, { initDb } from "@/db/database";
import { THEME } from "@/shared/constants/theme";
import migrations from "@/ziltchat.db/migrations";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import { Suspense, useEffect } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Providers } from "../shared/providers";

global.Buffer = global.Buffer || require("buffer").Buffer;
const queryClient = new QueryClient();
export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (!success) return;
    initDb();
  }, [success]);
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
