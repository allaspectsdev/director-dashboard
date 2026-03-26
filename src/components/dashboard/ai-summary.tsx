import Link from "next/link";
import { Brain, Rocket, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AI_STATUS_COLORS } from "@/lib/constants";
import type { AiInitiative } from "@/types";

interface AiSummaryProps {
  initiatives: AiInitiative[];
  stats: { deployed: number; inDevelopment: number; total: number };
}

export function AiSummary({ initiatives, stats }: AiSummaryProps) {
  return (
    <div className="widget-section">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Brain className="h-4 w-4 text-violet-500" />
          AI Initiatives
        </h3>
        <Link
          href="/ai"
          className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5"
        >
          View all <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="flex gap-3 mb-3">
        <div className="flex items-center gap-1.5 text-[11px]">
          <Rocket className="h-3 w-3 text-emerald-500" />
          <span className="font-semibold">{stats.deployed}</span>
          <span className="text-muted-foreground">deployed</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="font-semibold">{stats.inDevelopment}</span>
          <span className="text-muted-foreground">in dev</span>
        </div>
      </div>

      {initiatives.length === 0 ? (
        <p className="text-sm text-muted-foreground/50 text-center py-4">
          No AI initiatives yet.
        </p>
      ) : (
        <div className="space-y-2">
          {initiatives.map((init) => (
            <div key={init.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent/30 transition-colors">
              <span className="text-[12px] font-medium truncate flex-1">{init.name}</span>
              {init.model && (
                <span className="rounded bg-muted px-1 py-0 font-mono text-[9px] shrink-0">{init.model}</span>
              )}
              <Badge variant="secondary" className={cn("border-0 text-[9px] font-semibold capitalize px-1.5 py-0 shrink-0", AI_STATUS_COLORS[init.status])}>
                {init.status}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
