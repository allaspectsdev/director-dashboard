"use server";

import { db } from "@/db";
import { vendors } from "@/db/schema";
import { eq, desc, sql, count, sum } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getVendors(filters?: { category?: string; status?: string; search?: string }) {
  const conditions = [];
  if (filters?.category) conditions.push(eq(vendors.category, filters.category as typeof vendors.$inferSelect.category));
  if (filters?.status) conditions.push(eq(vendors.status, filters.status as typeof vendors.$inferSelect.status));
  if (filters?.search) conditions.push(sql`(${vendors.name} LIKE ${'%' + filters.search + '%'} OR ${vendors.description} LIKE ${'%' + filters.search + '%'})`);

  return db
    .select()
    .from(vendors)
    .where(conditions.length > 0 ? sql`${sql.join(conditions, sql` AND `)}` : undefined)
    .orderBy(
      sql`CASE ${vendors.status} WHEN 'active' THEN 0 WHEN 'evaluating' THEN 1 WHEN 'inactive' THEN 2 WHEN 'cancelled' THEN 3 END`,
      vendors.name
    );
}

export async function getVendor(id: number) {
  const result = await db.select().from(vendors).where(eq(vendors.id, id));
  return result[0] || null;
}

export async function createVendor(data: {
  name: string;
  description?: string;
  category: string;
  status?: string;
  contactName?: string;
  contactEmail?: string;
  website?: string;
  contractStart?: string;
  contractEnd?: string;
  annualCost?: number;
  monthlyCost?: number;
  notes?: string;
}) {
  const result = await db
    .insert(vendors)
    .values({
      name: data.name,
      description: data.description || null,
      category: data.category as typeof vendors.$inferInsert.category,
      status: (data.status || "active") as typeof vendors.$inferInsert.status,
      contactName: data.contactName || null,
      contactEmail: data.contactEmail || null,
      website: data.website || null,
      contractStart: data.contractStart || null,
      contractEnd: data.contractEnd || null,
      annualCost: data.annualCost || null,
      monthlyCost: data.monthlyCost || null,
      notes: data.notes || null,
    })
    .returning();

  revalidatePath("/vendors");
  revalidatePath("/");
  return result[0];
}

export async function updateVendor(
  id: number,
  data: Record<string, unknown>
) {
  const result = await db
    .update(vendors)
    .set({
      ...data,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(vendors.id, id))
    .returning();

  revalidatePath("/vendors");
  revalidatePath("/");
  return result[0];
}

export async function deleteVendor(id: number) {
  await db.delete(vendors).where(eq(vendors.id, id));
  revalidatePath("/vendors");
  revalidatePath("/");
}

export async function getVendorStats() {
  const [active] = await db
    .select({ count: count() })
    .from(vendors)
    .where(eq(vendors.status, "active"));

  const [totalAnnual] = await db
    .select({ total: sum(vendors.annualCost) })
    .from(vendors)
    .where(eq(vendors.status, "active"));

  const upcomingRenewals = await db
    .select()
    .from(vendors)
    .where(
      sql`${vendors.status} = 'active' AND ${vendors.contractEnd} IS NOT NULL AND ${vendors.contractEnd} <= date('now', '+90 days') AND ${vendors.contractEnd} >= date('now')`
    )
    .orderBy(vendors.contractEnd)
    .limit(5);

  return {
    activeCount: active?.count ?? 0,
    totalAnnualSpend: totalAnnual?.total ? Number(totalAnnual.total) : 0,
    upcomingRenewals,
  };
}
