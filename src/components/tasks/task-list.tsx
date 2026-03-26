"use client";

import { TaskCard } from "./task-card";
import { EmptyState } from "@/components/shared/empty-state";
import { SortableList } from "@/components/shared/sortable-list";
import { SortableItem } from "@/components/shared/sortable-item";
import { reorderTasks } from "@/actions/tasks";
import { CheckSquare } from "lucide-react";
import type { Task, Project } from "@/types";

interface TaskListProps {
  tasks: Task[];
  projects?: Project[];
}

export function TaskList({ tasks, projects }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={CheckSquare}
        title="No tasks yet"
        description="Create your first task to start tracking your work."
      />
    );
  }

  return (
    <SortableList items={tasks} onReorder={reorderTasks}>
      {(sortedTasks) => (
        <div className="space-y-1.5">
          {sortedTasks.map((task) => (
            <SortableItem key={task.id} id={task.id}>
              <TaskCard task={task} projects={projects} />
            </SortableItem>
          ))}
        </div>
      )}
    </SortableList>
  );
}
