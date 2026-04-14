"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Inbox, ChevronLeft, ChevronRight } from "lucide-react";
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
import { mockInboxItems } from "@/lib/mockData";
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

  // TODO: replace with real API call
  const [items, setItems] = useState<InboxItem[]>(mockInboxItems);

  const [selectedItem, setSelectedItem] = useState<InboxItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const typeFilter = defaultType ?? (searchParams.get("type") as IntakeType | null);
  const statusFilter = searchParams.get("status") as RequestStatus | null;
  const page = parseInt(searchParams.get("page") ?? "1", 10);

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

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (typeFilter && item.requestType !== typeFilter) return false;
      if (statusFilter && item.status !== statusFilter) return false;
      return true;
    });
  }, [items, typeFilter, statusFilter]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleUpdateStatus = (id: string, status: RequestStatus) => {
    // TODO: replace with real API call
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    setSelectedItem((prev) => (prev?.id === id ? { ...prev, status } : prev));
  };

  const openDrawer = (item: InboxItem) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

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
      {paginatedItems.length > 0 ? (
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
                {paginatedItems.map((item) => (
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
            {paginatedItems.map((item) => (
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
