"use client";

import { PriorityIndicator } from "@/components/shared/priority-indicator";
import { getDueDateLabel, isOverdue } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { Task, Project } from "@/types";

interface KanbanCardProps {
  task: Task;
  projects?: Project[];
}

export function KanbanCard({ task, projects }: KanbanCardProps) {
  const dueDateLabel = getDueDateLabel(task.dueDate);
  const overdue = isOverdue(task.dueDate) && task.status !== "done";
  const project = projects?.find((p) => p.id === task.projectId);

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-3 transition-all duration-200 hover:shadow-sm cursor-default",
        task.status === "done" && "opacity-50"
      )}
    >
      <div className="flex items-start gap-2">
        <PriorityIndicator priority={task.priority} className="mt-1.5 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-[13px] font-medium leading-snug",
              task.status === "done" && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </p>
          <div className="mt-1.5 flex items-center gap-2 flex-wrap">
            {project && (
              <span
                className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: project.color || "#6366f1" }}
                />
                {project.name}
              </span>
            )}
            {dueDateLabel && (
              <span
                className={cn(
                  "text-[10px] font-medium",
                  overdue ? "text-red-500" : "text-muted-foreground/60"
                )}
              >
                {dueDateLabel}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
