import Link from "next/link";
import { Shield, AlertTriangle, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SECURITY_SEVERITY_COLORS, SECURITY_CATEGORY_COLORS } from "@/lib/constants";
import type { SecurityItem } from "@/types";

interface SecuritySummaryProps {
  items: SecurityItem[];
  stats: { openCritical: number; openHigh: number; totalOpen: number };
}

export function SecuritySummary({ items, stats }: SecuritySummaryProps) {
  return (
    <div className="widget-section">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          Security & Compliance
        </h3>
        <Link
          href="/security"
          className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5"
        >
          View all <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {stats.openCritical > 0 && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-300/50 dark:border-red-500/20 bg-red-50/80 dark:bg-red-950/20 px-3 py-2">
          <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
          <span className="text-[12px] font-medium text-red-600 dark:text-red-400">
            {stats.openCritical} critical {stats.openCritical === 1 ? "issue" : "issues"} require attention
          </span>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground/50 text-center py-4">
          All clear — no open security items.
        </p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent/30 transition-colors">
              <Badge variant="secondary" className={cn("border-0 text-[9px] font-semibold capitalize px-1.5 py-0 shrink-0", SECURITY_SEVERITY_COLORS[item.severity])}>
                {item.severity}
              </Badge>
              <span className="text-[12px] font-medium truncate flex-1">{item.title}</span>
              <Badge variant="secondary" className={cn("border-0 text-[9px] capitalize px-1.5 py-0 shrink-0", SECURITY_CATEGORY_COLORS[item.category])}>
                {item.category}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
