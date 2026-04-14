import { apiClient } from "./client";
import { normalizeInboxItem } from "../utils";
import type { InboxItem, IntakeType, RequestStatus } from "../types";

export interface InboxFilters {
  type?: IntakeType;
  status?: RequestStatus;
  page?: number;
  limit?: number;
}

export interface PaginatedInboxResponse {
  items: InboxItem[];
  total: number;
  page: number;
  pages: number;
}

export async function getInboxItems(
  restaurantId: string,
  filters: InboxFilters = {}
): Promise<PaginatedInboxResponse> {
  const params = new URLSearchParams();
  if (filters.type) params.set("type", filters.type);
  if (filters.status) params.set("status", filters.status);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));

  const { data } = await apiClient.get<PaginatedInboxResponse>(
    `/api/v1/portal/restaurants/${restaurantId}/inbox?${params.toString()}`
  );
  return {
    ...data,
    items: data.items.map(normalizeInboxItem),
  };
}

export async function getInboxItem(
  restaurantId: string,
  itemId: string
): Promise<InboxItem> {
  const { data } = await apiClient.get<InboxItem>(
    `/api/v1/portal/restaurants/${restaurantId}/inbox/${itemId}`
  );
  return normalizeInboxItem(data);
}

export interface UpdateStatusRequest {
  status: RequestStatus;
}

export async function updateInboxItemStatus(
  restaurantId: string,
  itemId: string,
  status: RequestStatus
): Promise<InboxItem> {
  const { data } = await apiClient.patch<InboxItem>(
    `/api/v1/portal/restaurants/${restaurantId}/inbox/${itemId}/status`,
    { status }
  );
  return normalizeInboxItem(data);
}
