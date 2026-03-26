"use server";

import { db } from "@/db";
import { teamMembers, oneOnOnes } from "@/db/schema";
import { eq, desc, sql, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getTeamMembers() {
  return db
    .select()
    .from(teamMembers)
    .orderBy(
      sql`CASE ${teamMembers.status} WHEN 'active' THEN 0 WHEN 'on-leave' THEN 1 WHEN 'offboarded' THEN 2 END`,
      teamMembers.name
    );
}

export async function getTeamMember(id: number) {
  const result = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
  return result[0] || null;
}

export async function createTeamMember(data: {
  name: string;
  role: string;
  department: string;
  email?: string;
  startDate?: string;
  notes?: string;
}) {
  const result = await db
    .insert(teamMembers)
    .values({
      name: data.name,
      role: data.role,
      department: data.department as typeof teamMembers.$inferInsert.department,
      email: data.email || null,
      startDate: data.startDate || null,
      notes: data.notes || null,
    })
    .returning();

  revalidatePath("/team");
  return result[0];
}

export async function updateTeamMember(
  id: number,
  data: Record<string, unknown>
) {
  const result = await db
    .update(teamMembers)
    .set({
      ...data,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(teamMembers.id, id))
    .returning();

  revalidatePath("/team");
  return result[0];
}

export async function deleteTeamMember(id: number) {
  await db.delete(teamMembers).where(eq(teamMembers.id, id));
  revalidatePath("/team");
}

// 1:1 Meeting Management

export async function getOneOnOnes(teamMemberId: number) {
  return db
    .select()
    .from(oneOnOnes)
    .where(eq(oneOnOnes.teamMemberId, teamMemberId))
    .orderBy(desc(oneOnOnes.meetingDate));
}

export async function createOneOnOne(data: {
  teamMemberId: number;
  meetingDate: string;
  mood?: string;
  notes?: string;
  actionItems?: string;
  followUps?: string;
}) {
  const result = await db
    .insert(oneOnOnes)
    .values({
      teamMemberId: data.teamMemberId,
      meetingDate: data.meetingDate,
      mood: (data.mood || null) as typeof oneOnOnes.$inferInsert.mood,
      notes: data.notes || null,
      actionItems: data.actionItems || null,
      followUps: data.followUps || null,
    })
    .returning();

  revalidatePath("/team");
  return result[0];
}

export async function updateOneOnOne(
  id: number,
  data: Record<string, unknown>
) {
  const result = await db
    .update(oneOnOnes)
    .set({
      ...data,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(oneOnOnes.id, id))
    .returning();

  revalidatePath("/team");
  return result[0];
}

export async function deleteOneOnOne(id: number) {
  await db.delete(oneOnOnes).where(eq(oneOnOnes.id, id));
  revalidatePath("/team");
}

export async function getTeamStats() {
  const [active] = await db
    .select({ count: count() })
    .from(teamMembers)
    .where(eq(teamMembers.status, "active"));

  const byDepartment = await db
    .select({
      department: teamMembers.department,
      count: count(),
    })
    .from(teamMembers)
    .where(eq(teamMembers.status, "active"))
    .groupBy(teamMembers.department);

  return {
    activeCount: active?.count ?? 0,
    byDepartment,
  };
}
