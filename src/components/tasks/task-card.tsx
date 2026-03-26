"use client";

import { useState } from "react";
import { toggleTaskStatus, deleteTask } from "@/actions/tasks";
import { PriorityIndicator } from "@/components/shared/priority-indicator";
import { getDueDateLabel, isOverdue } from "@/lib/dates";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Task, Project } from "@/types";
import { TaskForm } from "./task-form";

interface TaskCardProps {
  task: Task;
  projects?: Project[];
}

export function TaskCard({ task, projects }: TaskCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  async function handleToggle() {
    await toggleTaskStatus(task.id);
  }

  async function handleDelete() {
    await deleteTask(task.id);
    toast.success("Task deleted");
  }

  const dueDateLabel = getDueDateLabel(task.dueDate);
  const overdue = isOverdue(task.dueDate) && task.status !== "done";

  return (
    <>
      <div
        className={cn(
          "group flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-all duration-200 hover:bg-accent/30 hover:border-border",
          task.status === "done" && "opacity-50"
        )}
      >
        <button
          onClick={handleToggle}
          className="flex-shrink-0 transition-all duration-200 hover:scale-110 active:scale-95"
          title="Toggle status"
        >
          {task.status === "done" ? (
            <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Check className="h-3 w-3" strokeWidth={3} />
            </div>
          ) : task.status === "in-progress" ? (
            <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-sky-400 dark:border-sky-500">
              <div className="h-1.5 w-1.5 rounded-full bg-sky-400 dark:bg-sky-500 animate-pulse" />
            </div>
          ) : (
            <div className="h-[18px] w-[18px] rounded-full border-2 border-muted-foreground/25 transition-colors group-hover:border-muted-foreground/40" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "truncate text-[13px] font-medium",
                task.status === "done" && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </span>
            <PriorityIndicator priority={task.priority} />
          </div>
          {task.description && (
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground/60">
              {task.description}
            </p>
          )}
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          {dueDateLabel && (
            <span
              className={cn(
                "text-[11px] font-medium tabular-nums",
                overdue
                  ? "text-red-500 dark:text-red-400"
                  : "text-muted-foreground/60"
              )}
            >
              {dueDateLabel}
            </span>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                />
              }
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Pencil className="mr-2 h-3.5 w-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <TaskForm
        task={task}
        projects={projects}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
