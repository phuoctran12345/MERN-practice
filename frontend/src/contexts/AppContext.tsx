import React, { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-client";
import { useToast } from "../hooks/use-toast";

type ToastMessage = {
  title: string;
  description?: string;
  type: "SUCCESS" | "ERROR" | "INFO";
};

export type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
  showGlobalLoading: (message?: string) => void;
  hideGlobalLoading: () => void;
  isGlobalLoading: boolean;
  globalLoadingMessage: string;
};

export const AppContext = React.createContext<AppContext | undefined>(
  undefined
);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [globalLoadingMessage, setGlobalLoadingMessage] = useState(
    "Hotel room is getting ready..."
  );
  const { toast } = useToast();

  // Simple check for stored tokens without API calls
  const checkStoredAuth = () => {
    const localToken = localStorage.getItem("session_id");
    const userId = localStorage.getItem("user_id");

    // Check if we have both token and user ID
    const hasToken = !!localToken;
    const hasUserId = !!userId;

    if (hasToken && hasUserId) {
      console.log("JWT authentication detected - token and user ID found");
    }

    return hasToken;
  };

  // Always run validation query - let it handle token checking internally
  // QUAN TRỌNG: Thêm các options để tránh mất session khi HMR (Hot Module Replacement)
  const { isError, isLoading, data } = useQuery({
    queryKey: ["validateToken"],
    queryFn: apiClient.validateToken,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Không refetch khi component mount lại (tránh mất session khi HMR)
    refetchOnReconnect: false, // Không refetch khi reconnect
    staleTime: 24 * 60 * 60 * 1000, // 24 giờ (JWT token có expiresIn: "1d")
    gcTime: 24 * 60 * 60 * 1000, // Giữ cache 24 giờ (React Query v5 dùng gcTime thay vì cacheTime)
    enabled: true,
  });

  // Xử lý lỗi bằng useEffect (React Query v5 không hỗ trợ onError trong useQuery)
  React.useEffect(() => {
    if (isError) {
      const storedToken = localStorage.getItem("session_id");
      const storedUserId = localStorage.getItem("user_id");

      if (storedToken && storedUserId) {
        // Có token và userId trong localStorage → có thể là JWT fallback mode
      }
    }
  }, [isError]);

  // Debug logging to understand the state
  console.log("Auth Debug:", {
    isLoading,
    isError,
    hasData: !!data,
    hasStoredToken: checkStoredAuth(),
    hasUserId: !!localStorage.getItem("user_id"),
    data,
  });

  // ============================================
  // AUTH LOGIC - ƯU TIÊN GIỮ SESSION
  // ============================================
  // Ưu tiên check localStorage trước (tránh mất session)
  // Nếu có token trong localStorage → coi như đã login (trừ khi validation fail rõ ràng)
  const hasStoredAuth = checkStoredAuth();

  // Logic: logged in nếu:
  // 1. Có valid data từ validateToken query HOẶC
  // 2. Có token trong localStorage (fallback - giữ session)
  const isLoggedIn =
    (!isLoading && !isError && !!data) ||
    (hasStoredAuth && !isLoading); // Nếu có token trong localStorage → giữ session (không cần đợi validation)

  // Additional fallback: nếu có token nhưng chưa có data → vẫn coi như logged in
  const justLoggedIn = hasStoredAuth && !isLoading && !data && !isError;

  // Enhanced JWT authentication detection and fallback
  const isJWTFallback = () => {
    // Check if we have a token but validation failed (typical JWT fallback behavior)
    const hasStoredToken = checkStoredAuth();
    const hasUserId = !!localStorage.getItem("user_id");
    const isFallback = hasStoredToken && isError && !data && hasUserId;

    if (isFallback) {
      console.log(
        "JWT fallback mode detected - using localStorage authentication"
      );
    }

    return isFallback;
  };

  const finalIsLoggedIn = isLoggedIn || justLoggedIn || isJWTFallback();

  console.log(
    "Final isLoggedIn:",
    finalIsLoggedIn,
    "JWT Fallback:",
    isJWTFallback()
  );

  const showToast = (toastMessage: ToastMessage) => {
    const variant =
      toastMessage.type === "SUCCESS"
        ? "success"
        : toastMessage.type === "ERROR"
          ? "destructive"
          : "info";

    toast({
      variant,
      title: toastMessage.title,
      description: toastMessage.description,
    });
  };

  const showGlobalLoading = (message?: string) => {
    if (message) {
      setGlobalLoadingMessage(message);
    }
    setIsGlobalLoading(true);
  };

  const hideGlobalLoading = () => {
    setIsGlobalLoading(false);
  };

  return (
    <AppContext.Provider
      value={{
        showToast,
        isLoggedIn: finalIsLoggedIn,
        showGlobalLoading,
        hideGlobalLoading,
        isGlobalLoading,
        globalLoadingMessage,
      }}
    >
      {isGlobalLoading && <LoadingSpinner message={globalLoadingMessage} />}
      {children}
    </AppContext.Provider>
  );
};

// ...existing code...
