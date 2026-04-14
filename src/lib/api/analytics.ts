import { apiClient } from "./client";
import { normalizeAnalytics } from "../utils";
import type { AnalyticsSummary } from "../types";

export async function getAnalytics(
  restaurantId: string
): Promise<AnalyticsSummary> {
  const { data } = await apiClient.get<AnalyticsSummary>(
    `/api/v1/portal/restaurants/${restaurantId}/analytics`
  );
  return normalizeAnalytics(data);
}

export interface ThisWeekResponse {
  count: number;
}

export async function getThisWeekCount(
  restaurantId: string
): Promise<ThisWeekResponse> {
  const { data } = await apiClient.get<ThisWeekResponse>(
    `/api/v1/portal/restaurants/${restaurantId}/analytics/this-week`
  );
  return data;
}
