import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppContextProvider } from "./contexts/AppContext.tsx";
import { SearchContextProvider } from "./contexts/SearchContext.tsx";

// React Query v5 - QueryClient configuration
// QUAN TRỌNG: Cấu hình để tránh mất session khi HMR (Hot Module Replacement)
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Không refetch khi component mount lại (tránh mất session khi HMR)
      refetchOnReconnect: false, // Không refetch khi reconnect
      staleTime: 24 * 60 * 60 * 1000, // 24 giờ (JWT token có expiresIn: "1d")
      gcTime: 24 * 60 * 60 * 1000, // Giữ cache 24 giờ (React Query v5 dùng gcTime thay vì cacheTime)
    },
  },
});
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <SearchContextProvider>
          <App />
        </SearchContextProvider>
      </AppContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
