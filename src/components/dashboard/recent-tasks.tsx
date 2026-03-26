import Link from "next/link";
import { TaskCard } from "@/components/tasks/task-card";
import { CheckSquare, ArrowRight } from "lucide-react";
import type { Task } from "@/types";

interface RecentTasksProps {
  tasks: Task[];
}

export function RecentTasks({ tasks }: RecentTasksProps) {
  return (
    <div className="widget-section">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10 dark:bg-sky-500/15">
            <CheckSquare className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" strokeWidth={2} />
          </div>
          <h2 className="text-[13px] font-semibold tracking-tight">Upcoming Tasks</h2>
        </div>
        <Link
          href="/tasks"
          className="group flex items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          View all
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-[13px] text-muted-foreground/60">No open tasks</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground/40">
            Use the quick-add above or press N to create one
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
