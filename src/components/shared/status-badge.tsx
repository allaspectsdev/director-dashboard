import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  PROJECT_STATUS_COLORS,
  TASK_STATUS_COLORS,
  PRIORITY_COLORS,
  CONVERSATION_STATUS_COLORS,
  ENTRY_TYPE_COLORS,
} from "@/lib/constants";

const COLOR_MAPS: Record<string, Record<string, string>> = {
  project: PROJECT_STATUS_COLORS,
  task: TASK_STATUS_COLORS,
  priority: PRIORITY_COLORS,
  conversation: CONVERSATION_STATUS_COLORS,
  entry: ENTRY_TYPE_COLORS,
};

interface StatusBadgeProps {
  type: keyof typeof COLOR_MAPS;
  value: string;
  className?: string;
}

export function StatusBadge({ type, value, className }: StatusBadgeProps) {
  const colorMap = COLOR_MAPS[type] || {};
  const colorClass = colorMap[value] || "bg-gray-100 text-gray-700";

  return (
    <Badge
      variant="secondary"
      className={cn(
        "border-0 text-[10px] font-semibold capitalize tracking-wide px-2 py-0",
        colorClass,
        className
      )}
    >
      {value.replace(/-/g, " ")}
    </Badge>
  );
}
