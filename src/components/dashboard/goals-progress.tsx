import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { Target, ArrowRight } from "lucide-react";

interface GoalSummary {
  id: number;
  title: string;
  computedProgress: number;
}

interface GoalsProgressProps {
  goals: GoalSummary[];
}

export function GoalsProgress({ goals }: GoalsProgressProps) {
  return (
    <div className="widget-section">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 dark:bg-violet-500/15">
            <Target className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" strokeWidth={2} />
          </div>
          <h2 className="text-[13px] font-semibold tracking-tight">Goals</h2>
        </div>
        <Link
          href="/goals"
          className="group flex items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          View all
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-[13px] text-muted-foreground/60">No active goals</p>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium leading-tight">
                  {goal.title}
                </span>
                <span className="text-[11px] tabular-nums font-semibold text-primary ml-3 flex-shrink-0">
                  {goal.computedProgress}%
                </span>
              </div>
              <Progress value={goal.computedProgress} className="h-1.5" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
