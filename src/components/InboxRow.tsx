"use client";

import { TypeBadge } from "@/components/TypeBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { formatRelativeTime } from "@/lib/utils";
import type { InboxItem } from "@/lib/types";

interface InboxRowProps {
  item: InboxItem;
  onClick?: () => void;
  variant?: "table" | "card";
}

export function InboxRow({ item, onClick, variant = "table" }: InboxRowProps) {
  // Support both snake_case (API) and camelCase (normalized) field names
  const customerName = item.customerName ?? item.customer_name;
  const requestType = item.requestType ?? item.request_type;
  const createdAt = item.createdAt ?? item.created_at;

  if (variant === "card") {
    return (
      <button
        onClick={onClick}
        className="w-full rounded-lg border bg-card p-4 text-left transition-colors hover:bg-accent/50"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <span className="font-medium text-foreground">
              {customerName}
            </span>
            <span className="text-sm text-muted-foreground">{item.summary}</span>
          </div>
          <TypeBadge type={requestType} />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <StatusBadge status={item.status} />
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(createdAt)}
          </span>
        </div>
      </button>
    );
  }

  return (
    <tr
      onClick={onClick}
      className="cursor-pointer border-b transition-colors hover:bg-accent/50"
    >
      <td className="px-4 py-3">
        <TypeBadge type={requestType} />
      </td>
      <td className="px-4 py-3">
        <span className="font-medium text-foreground">{customerName}</span>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-muted-foreground">{item.summary}</span>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={item.status} />
      </td>
      <td className="px-4 py-3 text-right">
        <span className="text-sm text-muted-foreground">
          {formatRelativeTime(createdAt)}
        </span>
      </td>
    </tr>
  );
}
