import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { InboxItem, AnalyticsSummary, Restaurant, User } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Normalize API responses to support both snake_case and camelCase
export function normalizeInboxItem(item: InboxItem): InboxItem {
  return {
    ...item,
    requestType: item.request_type ?? item.requestType,
    restaurantId: item.restaurant_id ?? item.restaurantId,
    customerName: item.customer_name ?? item.customerName,
    customerPhone: item.customer_phone ?? item.customerPhone,
    createdAt: item.created_at ?? item.createdAt,
  };
}

export function normalizeAnalytics(data: AnalyticsSummary): AnalyticsSummary {
  return {
    ...data,
    restaurantId: data.restaurant_id ?? data.restaurantId,
    restaurantName: data.restaurant_name ?? data.restaurantName,
    totalRequests: data.total_requests ?? data.totalRequests,
    byType: data.by_type ?? data.byType,
    byStatus: data.by_status ?? data.byStatus,
  };
}

export function normalizeRestaurant(data: Restaurant): Restaurant {
  return {
    ...data,
    transferNumber: data.transfer_number ?? data.transferNumber,
    hoursJson: data.hours_json ?? data.hoursJson,
    readiness: {
      ...data.readiness,
      isReady: data.readiness.is_ready ?? data.readiness.isReady,
      missingFields: data.readiness.missing_fields ?? data.readiness.missingFields,
    },
  };
}

export function normalizeUser(data: User): User {
  return {
    ...data,
    restaurantId: data.restaurant_id ?? data.restaurantId,
  };
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
