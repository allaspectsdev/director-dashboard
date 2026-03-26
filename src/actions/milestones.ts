"use server";

import { db } from "@/db";
import { milestones } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { MilestoneStatus } from "@/types";

export async function createMilestone(data: {
  projectId: number;
  title: string;
  description?: string;
  targetDate?: string;
}) {
  const result = await db
    .insert(milestones)
    .values({
      projectId: data.projectId,
      title: data.title,
      description: data.description || null,
      targetDate: data.targetDate || null,
    })
    .returning();

  revalidatePath("/projects");
  revalidatePath(`/projects/${data.projectId}`);
  return result[0];
}

export async function updateMilestone(
  id: number,
  data: {
    title?: string;
    description?: string | null;
    targetDate?: string | null;
    status?: MilestoneStatus;
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
    .update(milestones)
    .set(updateData)
    .where(eq(milestones.id, id))
    .returning();

  revalidatePath("/projects");
  return result[0];
}

export async function toggleMilestoneStatus(id: number) {
  const [milestone] = await db
    .select()
    .from(milestones)
    .where(eq(milestones.id, id));
  if (!milestone) return null;

  const nextStatus: Record<string, MilestoneStatus> = {
    pending: "in-progress",
    "in-progress": "completed",
    completed: "pending",
  };

  return updateMilestone(id, {
    status: nextStatus[milestone.status] || "pending",
  });
}

export async function reorderMilestones(updates: { id: number; sortOrder: number }[]) {
  for (const update of updates) {
    await db.update(milestones).set({ sortOrder: update.sortOrder }).where(eq(milestones.id, update.id));
  }
  revalidatePath("/projects");
}

export async function deleteMilestone(id: number) {
  const [milestone] = await db
    .select()
    .from(milestones)
    .where(eq(milestones.id, id));
  await db.delete(milestones).where(eq(milestones.id, id));
  if (milestone) {
    revalidatePath(`/projects/${milestone.projectId}`);
  }
  revalidatePath("/projects");
}
