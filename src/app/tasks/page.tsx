import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { TaskForm } from "@/components/tasks/task-form";
import { TaskFilters } from "@/components/tasks/task-filters";
import { TaskList } from "@/components/tasks/task-list";
import { TaskKanban } from "@/components/tasks/task-kanban";
import { TaskTable } from "@/components/tasks/task-table";
import { getTasks } from "@/actions/tasks";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { TaskStatus, TaskPriority } from "@/types";

interface Props {
  searchParams: Promise<{
    status?: string;
    priority?: string;
    projectId?: string;
    search?: string;
    view?: string;
    sort?: string;
    dir?: string;
  }>;
}

export default async function TasksPage({ searchParams }: Props) {
  const params = await searchParams;
  const view = params.view || "list";

  const allProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.status, "active"));

  const taskList = await getTasks({
    status: params.status as TaskStatus | undefined,
    priority: params.priority as TaskPriority | undefined,
    projectId: params.projectId ? Number(params.projectId) : undefined,
    search: params.search || undefined,
    sortBy: params.sort || undefined,
    sortDir: (params.dir as "asc" | "desc") || undefined,
  });

  return (
    <div>
      <Header title="Tasks" description="Track and manage all your tasks.">
        <TaskForm projects={allProjects} />
      </Header>

      <div className="mt-6 space-y-5">
        <Suspense>
          <TaskFilters projects={allProjects} />
        </Suspense>

        {view === "board" ? (
          <TaskKanban tasks={taskList} projects={allProjects} />
        ) : view === "table" ? (
          <Suspense>
            <TaskTable tasks={taskList} projects={allProjects} />
          </Suspense>
        ) : (
          <TaskList tasks={taskList} projects={allProjects} />
        )}
      </div>
    </div>
  );
}
