"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import * as authApi from "../api/auth";
import { tokenStorage } from "../api/client";
import type { User, Restaurant } from "../types";

interface AuthContextValue {
  user: User | null;
  restaurant: Restaurant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const fetchUser = useCallback(async () => {
    const token = tokenStorage.getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await authApi.getMe();
      setUser(data.user);
      setRestaurant(data.restaurant);
    } catch {
      // Token is invalid, clear it
      tokenStorage.clearTokens();
      setUser(null);
      setRestaurant(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await authApi.login({ email, password });
        const data = await authApi.getMe();
        setUser(data.user);
        setRestaurant(data.restaurant);
        return { success: true };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Login failed";
        return { success: false, error: message };
      }
    },
    []
  );

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    setRestaurant(null);
    router.push("/login");
  }, [router]);

  const refetchUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        restaurant,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
