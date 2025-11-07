"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { Toaster } from "react-hot-toast";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // 🔹 optional: disable retry when offline
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      staleTime: 0,
      gcTime: 5 * 60 * 1000,
    },
    mutations: {
      retry: false, // 🔹 no auto-retry on failure
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <Toaster toastOptions={{ duration: 4000 }} /> */}
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  );
}
