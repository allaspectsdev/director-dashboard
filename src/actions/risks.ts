"use server";

import { db } from "@/db";
import { risks } from "@/db/schema";
import { eq, desc, sql, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getRisks() {
  return db
    .select()
    .from(risks)
    .orderBy(
      sql`CASE ${risks.status} WHEN 'identified' THEN 0 WHEN 'assessing' THEN 1 WHEN 'mitigating' THEN 2 WHEN 'monitoring' THEN 3 WHEN 'closed' THEN 4 END`,
      desc(sql`${risks.likelihood} * ${risks.impact}`),
      desc(risks.createdAt)
    );
}

export async function createRisk(data: {
  title: string;
  description?: string;
  category: string;
  likelihood: number;
  impact: number;
  status?: string;
  mitigationPlan?: string;
  owner?: string;
  reviewDate?: string;
  projectId?: number | null;
}) {
  const result = await db
    .insert(risks)
    .values({
      title: data.title,
      description: data.description || null,
      category: data.category as typeof risks.$inferInsert.category,
      likelihood: data.likelihood,
      impact: data.impact,
      status: (data.status || "identified") as typeof risks.$inferInsert.status,
      mitigationPlan: data.mitigationPlan || null,
      owner: data.owner || null,
      reviewDate: data.reviewDate || null,
      projectId: data.projectId || null,
    })
    .returning();

  revalidatePath("/risks");
  revalidatePath("/");
  return result[0];
}

export async function updateRisk(id: number, data: Record<string, unknown>) {
  const result = await db
    .update(risks)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(risks.id, id))
    .returning();

  revalidatePath("/risks");
  revalidatePath("/");
  return result[0];
}

export async function deleteRisk(id: number) {
  await db.delete(risks).where(eq(risks.id, id));
  revalidatePath("/risks");
  revalidatePath("/");
}

export async function getRiskStats() {
  const allRisks = await db.select().from(risks).where(sql`${risks.status} != 'closed'`);

  let critical = 0, high = 0, medium = 0, low = 0;
  for (const risk of allRisks) {
    const score = risk.likelihood * risk.impact;
    if (score >= 20) critical++;
    else if (score >= 12) high++;
    else if (score >= 6) medium++;
    else low++;
  }

  return { critical, high, medium, low, total: allRisks.length };
}
