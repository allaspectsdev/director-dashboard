"use server";

import { db } from "@/db";
import { goals, goalProjects, goalMilestones, milestones, projects } from "@/db/schema";
import { eq, desc, asc, count, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { GoalStatus } from "@/types";

export async function getGoals() {
  const allGoals = await db
    .select()
    .from(goals)
    .orderBy(asc(sql`CASE WHEN ${goals.status} = 'active' THEN 0 ELSE 1 END`), desc(goals.createdAt));

  const withDetails = await Promise.all(
    allGoals.map(async (goal) => {
      const linkedProjects = await db
        .select({ project: projects })
        .from(goalProjects)
        .innerJoin(projects, eq(goalProjects.projectId, projects.id))
        .where(eq(goalProjects.goalId, goal.id));

      const linkedMilestones = await db
        .select({ milestone: milestones })
        .from(goalMilestones)
        .innerJoin(milestones, eq(goalMilestones.milestoneId, milestones.id))
        .where(eq(goalMilestones.goalId, goal.id));

      let progress = goal.progressPercentage;
      if (goal.trackingType === "milestone" && linkedMilestones.length > 0) {
        const completed = linkedMilestones.filter(
          (lm) => lm.milestone.status === "completed"
        ).length;
        progress = Math.round((completed / linkedMilestones.length) * 100);
      }

      return {
        ...goal,
        projects: linkedProjects.map((lp) => lp.project),
        milestones: linkedMilestones.map((lm) => lm.milestone),
        computedProgress: progress,
      };
    })
  );

  return withDetails;
}

export async function createGoal(data: {
  title: string;
  description?: string;
  trackingType?: "percentage" | "milestone";
  targetDate?: string;
}) {
  const result = await db
    .insert(goals)
    .values({
      title: data.title,
      description: data.description || null,
      trackingType: data.trackingType || "percentage",
      targetDate: data.targetDate || null,
    })
    .returning();

  revalidatePath("/goals");
  revalidatePath("/");
  return result[0];
}

export async function updateGoal(
  id: number,
  data: {
    title?: string;
    description?: string | null;
    trackingType?: "percentage" | "milestone";
    progressPercentage?: number;
    status?: GoalStatus;
    targetDate?: string | null;
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
    .update(goals)
    .set(updateData)
    .where(eq(goals.id, id))
    .returning();

  revalidatePath("/goals");
  revalidatePath("/");
  return result[0];
}

export async function deleteGoal(id: number) {
  await db.delete(goals).where(eq(goals.id, id));
  revalidatePath("/goals");
  revalidatePath("/");
}

export async function linkProjectToGoal(goalId: number, projectId: number) {
  await db
    .insert(goalProjects)
    .values({ goalId, projectId })
    .onConflictDoNothing();
  revalidatePath("/goals");
}

export async function unlinkProjectFromGoal(goalId: number, projectId: number) {
  await db
    .delete(goalProjects)
    .where(
      sql`${goalProjects.goalId} = ${goalId} AND ${goalProjects.projectId} = ${projectId}`
    );
  revalidatePath("/goals");
}

export async function linkMilestoneToGoal(goalId: number, milestoneId: number) {
  await db
    .insert(goalMilestones)
    .values({ goalId, milestoneId })
    .onConflictDoNothing();
  revalidatePath("/goals");
}

export async function unlinkMilestoneFromGoal(goalId: number, milestoneId: number) {
  await db
    .delete(goalMilestones)
    .where(
      sql`${goalMilestones.goalId} = ${goalId} AND ${goalMilestones.milestoneId} = ${milestoneId}`
    );
  revalidatePath("/goals");
}
