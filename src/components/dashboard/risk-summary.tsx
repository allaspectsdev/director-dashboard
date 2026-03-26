import Link from "next/link";
import { ShieldAlert, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getRiskLevel, RISK_STATUS_COLORS } from "@/lib/constants";
import type { Risk } from "@/types";

interface RiskSummaryProps {
  risks: Risk[];
  stats: { critical: number; high: number; medium: number; low: number; total: number };
}

export function RiskSummary({ risks, stats }: RiskSummaryProps) {
  return (
    <div className="widget-section">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-primary" />
          Risk Register
        </h3>
        <Link
          href="/risks"
          className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5"
        >
          View all <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Risk level distribution bar */}
      {stats.total > 0 && (
        <div className="mb-3">
          <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
            {stats.critical > 0 && (
              <div className="bg-red-500" style={{ flex: stats.critical }} title={`${stats.critical} critical`} />
            )}
            {stats.high > 0 && (
              <div className="bg-orange-500" style={{ flex: stats.high }} title={`${stats.high} high`} />
            )}
            {stats.medium > 0 && (
              <div className="bg-amber-500" style={{ flex: stats.medium }} title={`${stats.medium} medium`} />
            )}
            {stats.low > 0 && (
              <div className="bg-blue-500" style={{ flex: stats.low }} title={`${stats.low} low`} />
            )}
          </div>
          <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
            <span>{stats.critical} critical</span>
            <span>{stats.high} high</span>
            <span>{stats.medium} med</span>
            <span>{stats.low} low</span>
          </div>
        </div>
      )}

      {risks.length === 0 ? (
        <p className="text-sm text-muted-foreground/50 text-center py-4">
          No open risks registered.
        </p>
      ) : (
        <div className="space-y-2">
          {risks.map((risk) => {
            const level = getRiskLevel(risk.likelihood, risk.impact);
            return (
              <div key={risk.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent/30 transition-colors">
                <Badge variant="secondary" className={cn("border-0 text-[9px] font-semibold px-1.5 py-0 shrink-0", level.color)}>
                  {risk.likelihood * risk.impact}
                </Badge>
                <span className="text-[12px] font-medium truncate flex-1">{risk.title}</span>
                <Badge variant="secondary" className={cn("border-0 text-[9px] capitalize px-1.5 py-0 shrink-0", RISK_STATUS_COLORS[risk.status])}>
                  {risk.status}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
