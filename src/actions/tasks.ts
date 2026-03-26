"use server";

import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq, desc, asc, and, like, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { TaskStatus, TaskPriority } from "@/types";
import { parseRecurrenceRule, getNextOccurrence } from "@/lib/recurrence";

export async function getTasks(filters?: {
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}) {
  const conditions = [];

  if (filters?.status) {
    conditions.push(eq(tasks.status, filters.status));
  }
  if (filters?.priority) {
    conditions.push(eq(tasks.priority, filters.priority));
  }
  if (filters?.projectId) {
    conditions.push(eq(tasks.projectId, filters.projectId));
  }
  if (filters?.search) {
    conditions.push(like(tasks.title, `%${filters.search}%`));
  }

  const orderClauses = [];
  if (filters?.sortBy) {
    const dir = filters.sortDir === "desc" ? desc : asc;
    switch (filters.sortBy) {
      case "title": orderClauses.push(dir(tasks.title)); break;
      case "status": orderClauses.push(dir(tasks.status)); break;
      case "dueDate": orderClauses.push(dir(tasks.dueDate)); break;
      case "createdAt": orderClauses.push(dir(tasks.createdAt)); break;
      case "priority": {
        const dirFn = filters.sortDir === "desc" ? asc : desc;
        orderClauses.push(dirFn(sql`CASE ${tasks.priority} WHEN 'urgent' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END`));
        break;
      }
    }
  }
  if (orderClauses.length === 0) {
    orderClauses.push(
      asc(sql`CASE WHEN ${tasks.status} = 'done' THEN 1 ELSE 0 END`),
      desc(sql`CASE ${tasks.priority} WHEN 'urgent' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END`),
      asc(tasks.dueDate),
      desc(tasks.createdAt)
    );
  }

  const result = await db
    .select()
    .from(tasks)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(...orderClauses);

  return result;
}

export async function getTask(id: number) {
  const result = await db.select().from(tasks).where(eq(tasks.id, id));
  return result[0] || null;
}

export async function createTask(data: {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  projectId?: number | null;
  milestoneId?: number | null;
  conversationId?: number | null;
}) {
  const result = await db
    .insert(tasks)
    .values({
      title: data.title,
      description: data.description || null,
      status: data.status || "todo",
      priority: data.priority || "medium",
      dueDate: data.dueDate || null,
      projectId: data.projectId || null,
      milestoneId: data.milestoneId || null,
      conversationId: data.conversationId || null,
    })
    .returning();

  revalidatePath("/tasks");
  revalidatePath("/");
  return result[0];
}

export async function updateTask(
  id: number,
  data: {
    title?: string;
    description?: string | null;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string | null;
    projectId?: number | null;
    milestoneId?: number | null;
  }
) {
  const updateData: Record<string, unknown> = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  if (data.status === "done") {
    updateData.completedDate = new Date().toISOString().split("T")[0];
  } else if (data.status) {
    updateData.completedDate = null;
  }

  const result = await db
    .update(tasks)
    .set(updateData)
    .where(eq(tasks.id, id))
    .returning();

  // Auto-generate next recurring task instance
  if (data.status === "done" && result[0]?.isRecurring && result[0]?.recurrenceRule) {
    const rule = parseRecurrenceRule(result[0].recurrenceRule);
    if (rule) {
      const nextDueDate = getNextOccurrence(rule, result[0].dueDate || new Date().toISOString().split("T")[0]);
      await db.insert(tasks).values({
        title: result[0].title,
        description: result[0].description,
        priority: result[0].priority,
        projectId: result[0].projectId,
        milestoneId: result[0].milestoneId,
        dueDate: nextDueDate,
        recurrenceRule: result[0].recurrenceRule,
        recurrenceSourceId: result[0].id,
        isRecurring: true,
      });
    }
  }

  revalidatePath("/tasks");
  revalidatePath("/");
  revalidatePath("/projects");
  return result[0];
}

export async function toggleTaskStatus(id: number) {
  const task = await getTask(id);
  if (!task) return null;

  const nextStatus: Record<string, TaskStatus> = {
    todo: "in-progress",
    "in-progress": "done",
    done: "todo",
  };

  return updateTask(id, { status: nextStatus[task.status] || "todo" });
}

export async function deleteTask(id: number) {
  await db.delete(tasks).where(eq(tasks.id, id));
  revalidatePath("/tasks");
  revalidatePath("/");
  revalidatePath("/projects");
}

export async function bulkUpdateTasks(
  ids: number[],
  data: { status?: TaskStatus; priority?: TaskPriority; projectId?: number | null }
) {
  for (const id of ids) {
    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    if (data.status === "done") {
      updateData.completedDate = new Date().toISOString().split("T")[0];
    } else if (data.status) {
      updateData.completedDate = null;
    }
    await db.update(tasks).set(updateData).where(eq(tasks.id, id));
  }
  revalidatePath("/tasks");
  revalidatePath("/");
  revalidatePath("/projects");
}

export async function bulkDeleteTasks(ids: number[]) {
  for (const id of ids) {
    await db.delete(tasks).where(eq(tasks.id, id));
  }
  revalidatePath("/tasks");
  revalidatePath("/");
  revalidatePath("/projects");
}

export async function reorderTasks(updates: { id: number; sortOrder: number; status?: TaskStatus }[]) {
  for (const update of updates) {
    const data: Record<string, unknown> = { sortOrder: update.sortOrder };
    if (update.status) {
      data.status = update.status;
      data.updatedAt = new Date().toISOString();
      if (update.status === "done") {
        data.completedDate = new Date().toISOString().split("T")[0];
      } else {
        data.completedDate = null;
      }
    }
    await db.update(tasks).set(data).where(eq(tasks.id, update.id));
  }
  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function getUpcomingTasks(limit = 5) {
  return db
    .select()
    .from(tasks)
    .where(sql`${tasks.status} != 'done'`)
    .orderBy(asc(tasks.dueDate), desc(sql`CASE ${tasks.priority} WHEN 'urgent' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END`))
    .limit(limit);
}
