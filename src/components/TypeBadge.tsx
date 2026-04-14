import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { IntakeType } from "@/lib/types";

const typeConfig: Record<IntakeType, { label: string; className: string }> = {
  reservation: {
    label: "Reservation",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  },
  order: {
    label: "Order",
    className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  },
  callback: {
    label: "Callback",
    className: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  },
  catering: {
    label: "Catering",
    className: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  },
};

interface TypeBadgeProps {
  type: IntakeType;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const config = typeConfig[type];
  return (
    <Badge variant="secondary" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
