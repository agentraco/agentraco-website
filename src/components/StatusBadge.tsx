import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RequestStatus } from "@/lib/types";

const statusConfig: Record<RequestStatus, { label: string; className: string }> = {
  received: {
    label: "Received",
    className: "bg-red-100 text-red-700 hover:bg-red-100",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-primary/10 text-primary hover:bg-primary/10",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-slate-100 text-slate-600 hover:bg-slate-100",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  },
};

interface StatusBadgeProps {
  status: RequestStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant="secondary" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
