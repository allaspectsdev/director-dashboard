"use client";

import { useOptimistic, useTransition } from "react";
import { updateTask } from "@/actions/tasks";
import { KanbanCard } from "./kanban-card";
import { TASK_STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Task, Project, TaskStatus } from "@/types";

const COLUMN_CONFIG: Record<string, { label: string; color: string }> = {
  todo: { label: "To Do", color: "bg-gray-400" },
  "in-progress": { label: "In Progress", color: "bg-sky-500" },
  done: { label: "Done", color: "bg-emerald-500" },
};

interface TaskKanbanProps {
  tasks: Task[];
  projects?: Project[];
}

export function TaskKanban({ tasks, projects }: TaskKanbanProps) {
  const [, startTransition] = useTransition();
  const [optimisticTasks, setOptimisticTasks] = useOptimistic(tasks);

  function handleDrop(e: React.DragEvent, targetStatus: TaskStatus) {
    e.preventDefault();
    const taskId = Number(e.dataTransfer.getData("text/plain"));
    if (!taskId) return;

    const task = optimisticTasks.find((t) => t.id === taskId);
    if (!task || task.status === targetStatus) return;

    startTransition(async () => {
      setOptimisticTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: targetStatus } : t))
      );
      await updateTask(taskId, { status: targetStatus });
    });
  }

  function handleDragStart(e: React.DragEvent, taskId: number) {
    e.dataTransfer.setData("text/plain", taskId.toString());
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {TASK_STATUSES.map((status) => {
        const config = COLUMN_CONFIG[status];
        const columnTasks = optimisticTasks.filter((t) => t.status === status);

        return (
          <div
            key={status}
            className="flex flex-col rounded-xl border bg-muted/30 p-3"
            onDrop={(e) => handleDrop(e, status)}
            onDragOver={handleDragOver}
          >
            <div className="flex items-center gap-2 px-1 pb-3">
              <div className={cn("h-2 w-2 rounded-full", config.color)} />
              <h3 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                {config.label}
              </h3>
              <span className="ml-auto text-[11px] tabular-nums font-medium text-muted-foreground/50">
                {columnTasks.length}
              </span>
            </div>

            <div className="flex-1 space-y-2 min-h-[120px]">
              {columnTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <KanbanCard task={task} projects={projects} />
                </div>
              ))}
              {columnTasks.length === 0 && (
                <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-border/50">
                  <p className="text-[11px] text-muted-foreground/40">
                    Drop tasks here
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
