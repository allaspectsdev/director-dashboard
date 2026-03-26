"use server";

import { db } from "@/db";
import { securityItems } from "@/db/schema";
import { eq, desc, sql, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { SecurityCategory, SecuritySeverity, SecurityStatus } from "@/types";

export async function getSecurityItems(filters?: {
  category?: SecurityCategory;
  severity?: SecuritySeverity;
  status?: SecurityStatus;
}) {
  const conditions = [];
  if (filters?.category) conditions.push(eq(securityItems.category, filters.category));
  if (filters?.severity) conditions.push(eq(securityItems.severity, filters.severity));
  if (filters?.status) conditions.push(eq(securityItems.status, filters.status));

  return db
    .select()
    .from(securityItems)
    .where(conditions.length > 0 ? sql`${sql.join(conditions, sql` AND `)}` : undefined)
    .orderBy(
      sql`CASE ${securityItems.severity} WHEN 'critical' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 WHEN 'info' THEN 4 END`,
      desc(securityItems.createdAt)
    );
}

export async function getSecurityItem(id: number) {
  const result = await db.select().from(securityItems).where(eq(securityItems.id, id));
  return result[0] || null;
}

export async function createSecurityItem(data: {
  title: string;
  description?: string;
  category: SecurityCategory;
  severity: SecuritySeverity;
  status?: SecurityStatus;
  framework?: string;
  dueDate?: string;
  assignee?: string;
  projectId?: number | null;
}) {
  const result = await db
    .insert(securityItems)
    .values({
      title: data.title,
      description: data.description || null,
      category: data.category,
      severity: data.severity,
      status: data.status || "open",
      framework: data.framework || null,
      dueDate: data.dueDate || null,
      assignee: data.assignee || null,
      projectId: data.projectId || null,
    })
    .returning();

  revalidatePath("/security");
  revalidatePath("/");
  return result[0];
}

export async function updateSecurityItem(
  id: number,
  data: {
    title?: string;
    description?: string | null;
    category?: SecurityCategory;
    severity?: SecuritySeverity;
    status?: SecurityStatus;
    framework?: string | null;
    dueDate?: string | null;
    assignee?: string | null;
    projectId?: number | null;
  }
) {
  const updateData: Record<string, unknown> = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  if (data.status === "resolved") {
    updateData.resolvedDate = new Date().toISOString().split("T")[0];
  }

  const result = await db
    .update(securityItems)
    .set(updateData)
    .where(eq(securityItems.id, id))
    .returning();

  revalidatePath("/security");
  revalidatePath("/");
  return result[0];
}

export async function deleteSecurityItem(id: number) {
  await db.delete(securityItems).where(eq(securityItems.id, id));
  revalidatePath("/security");
  revalidatePath("/");
}

export async function getSecurityStats() {
  const [openCritical] = await db
    .select({ count: count() })
    .from(securityItems)
    .where(sql`${securityItems.status} NOT IN ('resolved', 'accepted') AND ${securityItems.severity} = 'critical'`);

  const [openHigh] = await db
    .select({ count: count() })
    .from(securityItems)
    .where(sql`${securityItems.status} NOT IN ('resolved', 'accepted') AND ${securityItems.severity} = 'high'`);

  const [totalOpen] = await db
    .select({ count: count() })
    .from(securityItems)
    .where(sql`${securityItems.status} NOT IN ('resolved', 'accepted')`);

  const [overdue] = await db
    .select({ count: count() })
    .from(securityItems)
    .where(sql`${securityItems.status} NOT IN ('resolved', 'accepted') AND ${securityItems.dueDate} IS NOT NULL AND ${securityItems.dueDate} < date('now')`);

  return {
    openCritical: openCritical?.count ?? 0,
    openHigh: openHigh?.count ?? 0,
    totalOpen: totalOpen?.count ?? 0,
    overdue: overdue?.count ?? 0,
  };
}
