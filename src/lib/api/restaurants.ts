import { apiClient } from "./client";
import { normalizeRestaurant } from "../utils";
import type { Restaurant, HoursJson } from "../types";

export async function getRestaurant(restaurantId: string): Promise<Restaurant> {
  const { data } = await apiClient.get<Restaurant>(
    `/api/v1/portal/restaurants/${restaurantId}`
  );
  return normalizeRestaurant(data);
}

export interface UpdateRestaurantRequest {
  name?: string;
  phone?: string | null;
  address?: string | null;
  timezone?: string | null;
  transfer_number?: string | null;
  hours_json?: HoursJson | null;
}

export async function updateRestaurant(
  restaurantId: string,
  updates: UpdateRestaurantRequest
): Promise<Restaurant> {
  const { data } = await apiClient.patch<Restaurant>(
    `/api/v1/portal/restaurants/${restaurantId}`,
    updates
  );
  return normalizeRestaurant(data);
}
