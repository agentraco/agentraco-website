"use client";

import { Phone, Clock, MessageSquare } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TypeBadge } from "@/components/TypeBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { formatRelativeTime } from "@/lib/utils";
import type { InboxItem, RequestStatus } from "@/lib/types";

interface InboxDetailDrawerProps {
  item: InboxItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (id: string, status: RequestStatus) => void;
}

export function InboxDetailDrawer({
  item,
  open,
  onOpenChange,
  onUpdateStatus,
}: InboxDetailDrawerProps) {
  if (!item) return null;

  // Support both snake_case (API) and camelCase (normalized) field names
  const customerName = item.customerName ?? item.customer_name;
  const customerPhone = item.customerPhone ?? item.customer_phone;
  const requestType = item.requestType ?? item.request_type;
  const createdAt = item.createdAt ?? item.created_at;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <TypeBadge type={requestType} />
            <StatusBadge status={item.status} />
          </div>
          <SheetTitle className="text-left text-xl">
            {customerName}
          </SheetTitle>
          <SheetDescription className="text-left">
            {item.summary}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-6">
          {/* Contact Info */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-foreground">
              Contact Information
            </h3>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a
                href={`tel:${customerPhone}`}
                className="text-primary hover:underline"
              >
                {customerPhone}
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatRelativeTime(createdAt)}</span>
              <span className="text-xs">via {item.source}</span>
            </div>
          </div>

          <Separator />

          {/* Notes */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-foreground">Notes</h3>
            {item.notes ? (
              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                <MessageSquare className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-foreground">{item.notes}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No notes recorded</p>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-foreground">Actions</h3>
            <div className="flex flex-col gap-2">
              {item.status !== "confirmed" && (
                <Button
                  onClick={() => onUpdateStatus(item.id, "confirmed")}
                  className="w-full"
                >
                  Confirm Request
                </Button>
              )}
              {item.status !== "completed" && (
                <Button
                  variant="outline"
                  onClick={() => onUpdateStatus(item.id, "completed")}
                  className="w-full"
                >
                  Mark as Completed
                </Button>
              )}
              {item.status !== "cancelled" && (
                <Button
                  variant="outline"
                  onClick={() => onUpdateStatus(item.id, "cancelled")}
                  className="w-full text-destructive hover:text-destructive"
                >
                  Cancel Request
                </Button>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
