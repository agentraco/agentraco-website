"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InboxRow } from "@/components/InboxRow";
import { InboxDetailDrawer } from "@/components/InboxDetailDrawer";
import { InboxSkeleton } from "@/components/skeletons";
import { useAuth } from "@/lib/auth";
import { getInboxItems, updateInboxItemStatus } from "@/lib/api";
import type { InboxItem, IntakeType, RequestStatus } from "@/lib/types";

const ITEMS_PER_PAGE = 5;

interface InboxPageProps {
  title: string;
  description: string;
  defaultType?: IntakeType;
}

export function InboxPage({ title, description, defaultType }: InboxPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { restaurant } = useAuth();

  const [selectedItem, setSelectedItem] = useState<InboxItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const typeFilter = defaultType ?? (searchParams.get("type") as IntakeType | null);
  const statusFilter = searchParams.get("status") as RequestStatus | null;
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  const queryKey = [
    "inbox",
    restaurant?.id,
    { type: typeFilter, status: statusFilter, page },
  ];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () =>
      getInboxItems(restaurant!.id, {
        type: typeFilter ?? undefined,
        status: statusFilter ?? undefined,
        page,
        limit: ITEMS_PER_PAGE,
      }),
    enabled: !!restaurant?.id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      itemId,
      status,
    }: {
      itemId: string;
      status: RequestStatus;
    }) => updateInboxItemStatus(restaurant!.id, itemId, status),
    onMutate: async ({ itemId, status }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["inbox"] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update the cache
      queryClient.setQueryData(queryKey, (old: typeof data) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((item) =>
            item.id === itemId ? { ...item, status } : item
          ),
        };
      });

      // Update selected item if it's the one being updated
      if (selectedItem?.id === itemId) {
        setSelectedItem((prev) => (prev ? { ...prev, status } : null));
      }

      return { previousData };
    },
    onError: (err, _, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      toast.error("Failed to update status", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    },
    onSuccess: () => {
      toast.success("Status updated");
    },
    onSettled: () => {
      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: ["inbox"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });

  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== "page") {
      params.delete("page");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleUpdateStatus = (id: string, status: RequestStatus) => {
    updateStatusMutation.mutate({ itemId: id, status });
  };

  const openDrawer = (item: InboxItem) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  if (isLoading) {
    return <InboxSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border bg-card py-16">
        <p className="text-lg font-medium text-foreground">
          Failed to load inbox
        </p>
        <p className="text-sm text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  const items = data?.items ?? [];
  const totalPages = data?.pages ?? 1;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {!defaultType && (
          <Select
            value={typeFilter ?? "all"}
            onValueChange={(v) => updateParams("type", v === "all" ? null : v)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="reservation">Reservation</SelectItem>
              <SelectItem value="order">Order</SelectItem>
              <SelectItem value="callback">Callback</SelectItem>
              <SelectItem value="catering">Catering</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Select
          value={statusFilter ?? "all"}
          onValueChange={(v) => updateParams("status", v === "all" ? null : v)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="received">Received</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Table */}
      {items.length > 0 ? (
        <>
          <div className="hidden overflow-hidden rounded-lg border bg-card md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Summary
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <InboxRow
                    key={item.id}
                    item={item}
                    onClick={() => openDrawer(item)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {items.map((item) => (
              <InboxRow
                key={item.id}
                item={item}
                variant="card"
                onClick={() => openDrawer(item)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => updateParams("page", String(page - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => updateParams("page", String(page + 1))}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border bg-card py-16">
          <Inbox className="h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-lg font-medium text-foreground">
            No requests found
          </p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters
          </p>
        </div>
      )}

      {/* Detail Drawer */}
      <InboxDetailDrawer
        item={selectedItem}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
