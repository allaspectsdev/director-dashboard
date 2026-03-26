"use server";

import { db } from "@/db";
import { taskDependencies, tasks } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addDependency(taskId: number, blockedByTaskId: number) {
  if (taskId === blockedByTaskId) {
    throw new Error("A task cannot depend on itself");
  }

  // Check for circular dependencies
  const visited = new Set<number>();
  const queue = [blockedByTaskId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === taskId) {
      throw new Error("This would create a circular dependency");
    }
    if (visited.has(current)) continue;
    visited.add(current);

    const deps = await db
      .select({ blockedByTaskId: taskDependencies.blockedByTaskId })
      .from(taskDependencies)
      .where(eq(taskDependencies.taskId, current));

    for (const dep of deps) {
      queue.push(dep.blockedByTaskId);
    }
  }

  await db
    .insert(taskDependencies)
    .values({ taskId, blockedByTaskId })
    .onConflictDoNothing();

  revalidatePath("/tasks");
}

export async function removeDependency(taskId: number, blockedByTaskId: number) {
  await db
    .delete(taskDependencies)
    .where(
      sql`${taskDependencies.taskId} = ${taskId} AND ${taskDependencies.blockedByTaskId} = ${blockedByTaskId}`
    );
  revalidatePath("/tasks");
}

export async function getBlockersForTask(taskId: number) {
  const result = await db
    .select({ blocker: tasks })
    .from(taskDependencies)
    .innerJoin(tasks, eq(taskDependencies.blockedByTaskId, tasks.id))
    .where(eq(taskDependencies.taskId, taskId));

  return result.map((r) => r.blocker);
}

export async function getBlockedTasks(taskId: number) {
  const result = await db
    .select({ blocked: tasks })
    .from(taskDependencies)
    .innerJoin(tasks, eq(taskDependencies.taskId, tasks.id))
    .where(eq(taskDependencies.blockedByTaskId, taskId));

  return result.map((r) => r.blocked);
}

export async function isTaskBlocked(taskId: number): Promise<boolean> {
  const blockers = await getBlockersForTask(taskId);
  return blockers.some((b) => b.status !== "done");
}

export async function getBlockedStatusMap(taskIds: number[]): Promise<Map<number, boolean>> {
  if (taskIds.length === 0) return new Map();

  const deps = await db
    .select({
      taskId: taskDependencies.taskId,
      blockerStatus: tasks.status,
    })
    .from(taskDependencies)
    .innerJoin(tasks, eq(taskDependencies.blockedByTaskId, tasks.id))
    .where(
      sql`${taskDependencies.taskId} IN (${sql.join(taskIds.map(id => sql`${id}`), sql`, `)})`
    );

  const map = new Map<number, boolean>();
  for (const dep of deps) {
    if (dep.blockerStatus !== "done") {
      map.set(dep.taskId, true);
    }
  }
  return map;
}
