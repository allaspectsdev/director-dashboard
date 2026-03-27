"use server";

import { db } from "@/db";
import { aiInitiatives } from "@/db/schema";
import { eq, desc, sql, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getAiInitiatives(filters?: { category?: string; status?: string; search?: string }) {
  const conditions = [];
  if (filters?.category) conditions.push(eq(aiInitiatives.category, filters.category as any));
  if (filters?.status) conditions.push(eq(aiInitiatives.status, filters.status as any));
  if (filters?.search) conditions.push(sql`(${aiInitiatives.name} LIKE ${'%' + filters.search + '%'} OR ${aiInitiatives.description} LIKE ${'%' + filters.search + '%'})`);

  return db
    .select()
    .from(aiInitiatives)
    .where(conditions.length > 0 ? sql`${sql.join(conditions, sql` AND `)}` : undefined)
    .orderBy(
      sql`CASE ${aiInitiatives.status} WHEN 'deployed' THEN 0 WHEN 'testing' THEN 1 WHEN 'development' THEN 2 WHEN 'ideation' THEN 3 WHEN 'retired' THEN 4 END`,
      desc(aiInitiatives.updatedAt)
    );
}

export async function getAiInitiative(id: number) {
  const result = await db.select().from(aiInitiatives).where(eq(aiInitiatives.id, id));
  return result[0] || null;
}

export async function createAiInitiative(data: {
  name: string;
  description?: string;
  category: string;
  status?: string;
  model?: string;
  department?: string;
  impact?: string;
  roiEstimate?: string;
  vendorId?: number | null;
  projectId?: number | null;
  startDate?: string;
  launchDate?: string;
}) {
  const result = await db
    .insert(aiInitiatives)
    .values({
      name: data.name,
      description: data.description || null,
      category: data.category as typeof aiInitiatives.$inferInsert.category,
      status: (data.status || "ideation") as typeof aiInitiatives.$inferInsert.status,
      model: data.model || null,
      department: data.department || null,
      vendorId: data.vendorId || null,
      impact: data.impact || null,
      roiEstimate: data.roiEstimate || null,
      projectId: data.projectId || null,
      startDate: data.startDate || null,
      launchDate: data.launchDate || null,
    })
    .returning();

  revalidatePath("/ai");
  revalidatePath("/");
  return result[0];
}

export async function updateAiInitiative(
  id: number,
  data: {
    name?: string;
    description?: string | null;
    category?: string;
    status?: string;
    model?: string | null;
    department?: string | null;
    impact?: string | null;
    roiEstimate?: string | null;
    projectId?: number | null;
    startDate?: string | null;
    launchDate?: string | null;
  }
) {
  const result = await db
    .update(aiInitiatives)
    .set({
      ...data,
      updatedAt: new Date().toISOString(),
    } as Record<string, unknown>)
    .where(eq(aiInitiatives.id, id))
    .returning();

  revalidatePath("/ai");
  revalidatePath("/");
  return result[0];
}

export async function deleteAiInitiative(id: number) {
  await db.delete(aiInitiatives).where(eq(aiInitiatives.id, id));
  revalidatePath("/ai");
  revalidatePath("/");
}

export async function getAiStats() {
  const [deployed] = await db
    .select({ count: count() })
    .from(aiInitiatives)
    .where(eq(aiInitiatives.status, "deployed"));

  const [inDev] = await db
    .select({ count: count() })
    .from(aiInitiatives)
    .where(sql`${aiInitiatives.status} IN ('development', 'testing')`);

  const [total] = await db
    .select({ count: count() })
    .from(aiInitiatives);

  return {
    deployed: deployed?.count ?? 0,
    inDevelopment: inDev?.count ?? 0,
    total: total?.count ?? 0,
  };
}
