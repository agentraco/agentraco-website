import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  accent?: boolean;
}

export function SummaryCard({ title, value, icon: Icon, accent }: SummaryCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg",
            accent ? "bg-destructive/10" : "bg-primary/10"
          )}
        >
          <Icon
            className={cn(
              "h-6 w-6",
              accent ? "text-destructive" : "text-primary"
            )}
          />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p
            className={cn(
              "text-2xl font-bold",
              accent && value > 0 ? "text-destructive" : "text-foreground"
            )}
          >
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
