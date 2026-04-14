"use client";

import { useState, useCallback } from "react";
import { mockUser, mockRestaurant } from "./mockData";
import type { User, Restaurant } from "./types";

interface AuthState {
  user: User | null;
  restaurant: Restaurant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// TODO: replace with real auth implementation
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: mockUser,
    restaurant: mockRestaurant,
    isAuthenticated: true,
    isLoading: false,
  });

  const login = useCallback(async (_email: string, _password: string) => {
    // TODO: replace with real API call
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setAuthState({
      user: mockUser,
      restaurant: mockRestaurant,
      isAuthenticated: true,
      isLoading: false,
    });
    
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    // TODO: replace with real API call
    setAuthState({
      user: null,
      restaurant: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  return {
    ...authState,
    login,
    logout,
  };
}
