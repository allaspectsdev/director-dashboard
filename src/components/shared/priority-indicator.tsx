import { cn } from "@/lib/utils";
import { PRIORITY_DOT_COLORS } from "@/lib/constants";

interface PriorityIndicatorProps {
  priority: string;
  className?: string;
}

export function PriorityIndicator({ priority, className }: PriorityIndicatorProps) {
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        PRIORITY_DOT_COLORS[priority] || "bg-gray-400",
        className
      )}
      title={`${priority} priority`}
    />
  );
}
