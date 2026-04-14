import { apiClient, tokenStorage } from "./client";
import { normalizeUser, normalizeRestaurant } from "../utils";
import type { User, Restaurant } from "../types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface MeResponse {
  user: User;
  restaurant: Restaurant;
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(
    "/api/v1/auth/login",
    credentials
  );
  tokenStorage.setTokens(data.access_token, data.refresh_token);
  return data;
}

export async function getMe(): Promise<MeResponse> {
  const { data } = await apiClient.get<MeResponse>("/api/v1/auth/me");
  return {
    user: normalizeUser(data.user),
    restaurant: normalizeRestaurant(data.restaurant),
  };
}

export function logout(): void {
  tokenStorage.clearTokens();
}
