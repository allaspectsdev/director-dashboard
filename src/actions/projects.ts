"use server";

import { db } from "@/db";
import { projects, milestones, tasks } from "@/db/schema";
import { eq, desc, asc, sql, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { ProjectStatus } from "@/types";

export async function getProjects(filters?: {
  status?: ProjectStatus;
  priority?: string;
  search?: string;
}) {
  const conditions = [];
  if (filters?.status) conditions.push(eq(projects.status, filters.status));
  if (filters?.priority) conditions.push(eq(projects.priority, filters.priority as typeof projects.$inferSelect.priority));
  if (filters?.search) conditions.push(sql`(${projects.name} LIKE ${'%' + filters.search + '%'} OR ${projects.description} LIKE ${'%' + filters.search + '%'})`);

  return db
    .select()
    .from(projects)
    .where(conditions.length > 0 ? sql`${sql.join(conditions, sql` AND `)}` : undefined)
    .orderBy(asc(projects.sortOrder), desc(projects.createdAt));
}

export async function getProject(id: number) {
  const result = await db.select().from(projects).where(eq(projects.id, id));
  return result[0] || null;
}

export async function getProjectWithDetails(id: number) {
  const project = await getProject(id);
  if (!project) return null;

  const projectMilestones = await db
    .select()
    .from(milestones)
    .where(eq(milestones.projectId, id))
    .orderBy(asc(milestones.sortOrder), asc(milestones.targetDate));

  const projectTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.projectId, id))
    .orderBy(
      asc(sql`CASE WHEN ${tasks.status} = 'done' THEN 1 ELSE 0 END`),
      desc(tasks.createdAt)
    );

  return { ...project, milestones: projectMilestones, tasks: projectTasks };
}

export async function getProjectsWithStats(filters?: Parameters<typeof getProjects>[0]) {
  const allProjects = await getProjects(filters);
  const stats = await Promise.all(
    allProjects.map(async (project) => {
      const [milestoneStats] = await db
        .select({
          total: count(),
          completed: count(
            sql`CASE WHEN ${milestones.status} = 'completed' THEN 1 END`
          ),
        })
        .from(milestones)
        .where(eq(milestones.projectId, project.id));

      const [taskStats] = await db
        .select({
          total: count(),
          completed: count(
            sql`CASE WHEN ${tasks.status} = 'done' THEN 1 END`
          ),
        })
        .from(tasks)
        .where(eq(tasks.projectId, project.id));

      return {
        ...project,
        milestoneCount: milestoneStats?.total ?? 0,
        milestoneCompleted: milestoneStats?.completed ?? 0,
        taskCount: taskStats?.total ?? 0,
        taskCompleted: taskStats?.completed ?? 0,
      };
    })
  );
  return stats;
}

export async function createProject(data: {
  name: string;
  description?: string;
  status?: ProjectStatus;
  priority?: string;
  startDate?: string;
  targetDate?: string;
  color?: string;
}) {
  const result = await db
    .insert(projects)
    .values({
      name: data.name,
      description: data.description || null,
      status: data.status || "active",
      priority: (data.priority as "low" | "medium" | "high" | "urgent") || "medium",
      startDate: data.startDate || null,
      targetDate: data.targetDate || null,
      color: data.color || null,
    })
    .returning();

  revalidatePath("/projects");
  revalidatePath("/");
  return result[0];
}

export async function updateProject(
  id: number,
  data: {
    name?: string;
    description?: string | null;
    status?: ProjectStatus;
    priority?: string;
    startDate?: string | null;
    targetDate?: string | null;
    color?: string | null;
  }
) {
  const updateData: Record<string, unknown> = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  if (data.status === "completed") {
    updateData.completedDate = new Date().toISOString().split("T")[0];
  } else if (data.status) {
    updateData.completedDate = null;
  }

  const result = await db
    .update(projects)
    .set(updateData)
    .where(eq(projects.id, id))
    .returning();

  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  revalidatePath("/");
  return result[0];
}

export async function deleteProject(id: number) {
  await db.delete(projects).where(eq(projects.id, id));
  revalidatePath("/projects");
  revalidatePath("/");
}
