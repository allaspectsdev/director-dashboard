import { Lock } from "lucide-react";

interface BlockedBadgeProps {
  className?: string;
}

export function BlockedBadge({ className }: BlockedBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-400 ${className || ""}`}
    >
      <Lock className="h-2.5 w-2.5" />
      Blocked
    </span>
  );
}
