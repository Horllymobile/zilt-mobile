"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { Suspense } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Providers } from "../shared/providers";

const queryClient = new QueryClient();
export default function RootLayout() {
  // const { session } = useAuthStore();
  // const authToken = session?.token;
  // useEffect(() => {
  //   console.log("Socket Initialized");
  //   if (authToken) {
  //     socketService.connect(authToken);

  //     console.log(socketService.getSocket()?.id);

  //     return () => {
  //       socketService.disconnect();
  //     };
  //   }
  // }, []);
  return (
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
  );
}
