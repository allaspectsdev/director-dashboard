"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { toggleTaskStatus, deleteTask } from "@/actions/tasks";
import { PriorityIndicator } from "@/components/shared/priority-indicator";
import { StatusBadge } from "@/components/shared/status-badge";
import { getDueDateLabel, isOverdue, formatDateShort } from "@/lib/dates";
import { Button } from "@/components/ui/button";
import { Check, Circle, Clock, ArrowUpDown, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Task, Project } from "@/types";

interface TaskTableProps {
  tasks: Task[];
  projects?: Project[];
}

const columns = [
  { key: "title", label: "Title", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "priority", label: "Priority", sortable: true },
  { key: "dueDate", label: "Due Date", sortable: true },
  { key: "project", label: "Project", sortable: false },
  { key: "createdAt", label: "Created", sortable: true },
] as const;

const statusIcons: Record<string, React.ReactNode> = {
  todo: <Circle className="h-3.5 w-3.5 text-muted-foreground/50" />,
  "in-progress": <Clock className="h-3.5 w-3.5 text-sky-500" />,
  done: <Check className="h-3.5 w-3.5 text-emerald-500" />,
};

export function TaskTable({ tasks, projects }: TaskTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "";
  const currentDir = searchParams.get("dir") || "asc";

  function handleSort(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (currentSort === key) {
      params.set("dir", currentDir === "asc" ? "desc" : "asc");
    } else {
      params.set("sort", key);
      params.set("dir", "asc");
    }
    router.push(`/tasks?${params.toString()}`);
  }

  function getSortIcon(key: string) {
    if (currentSort !== key) return <ArrowUpDown className="h-3 w-3 opacity-30" />;
    return currentDir === "asc"
      ? <ArrowUp className="h-3 w-3 text-primary" />
      : <ArrowDown className="h-3 w-3 text-primary" />;
  }

  return (
    <div className="rounded-xl border overflow-hidden">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b bg-muted/30">
            <th className="w-8 px-3 py-2.5" />
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
                  col.sortable && "cursor-pointer select-none hover:text-foreground transition-colors"
                )}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className="flex items-center gap-1.5">
                  {col.label}
                  {col.sortable && getSortIcon(col.key)}
                </div>
              </th>
            ))}
            <th className="w-10 px-3 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const project = projects?.find((p) => p.id === task.projectId);
            const overdue = isOverdue(task.dueDate) && task.status !== "done";

            return (
              <tr
                key={task.id}
                className={cn(
                  "group border-b last:border-b-0 transition-colors hover:bg-muted/20",
                  task.status === "done" && "opacity-50"
                )}
              >
                <td className="px-3 py-2">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className="transition-transform hover:scale-110"
                  >
                    {statusIcons[task.status]}
                  </button>
                </td>
                <td className="px-3 py-2">
                  <span
                    className={cn(
                      "font-medium",
                      task.status === "done" && "line-through text-muted-foreground"
                    )}
                  >
                    {task.title}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <StatusBadge type="task" value={task.status} />
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <PriorityIndicator priority={task.priority} />
                    <span className="capitalize text-muted-foreground text-[12px]">
                      {task.priority}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2">
                  {task.dueDate ? (
                    <span
                      className={cn(
                        "text-[12px] tabular-nums",
                        overdue ? "font-medium text-red-500" : "text-muted-foreground"
                      )}
                    >
                      {getDueDateLabel(task.dueDate)}
                    </span>
                  ) : (
                    <span className="text-[12px] text-muted-foreground/30">--</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  {project ? (
                    <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: project.color || "#6366f1" }}
                      />
                      {project.name}
                    </span>
                  ) : (
                    <span className="text-[12px] text-muted-foreground/30">--</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <span className="text-[12px] text-muted-foreground/50">
                    {formatDateShort(task.createdAt)}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={async () => {
                      await deleteTask(task.id);
                      toast.success("Task deleted");
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            );
          })}
          {tasks.length === 0 && (
            <tr>
              <td colSpan={8} className="py-12 text-center text-[13px] text-muted-foreground/50">
                No tasks match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
