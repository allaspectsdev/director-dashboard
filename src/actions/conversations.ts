"use server";

import { db } from "@/db";
import {
  conversations,
  conversationEntries,
  conversationProjects,
  projects,
  tasks,
} from "@/db/schema";
import { eq, desc, asc, count, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { ConversationStatus } from "@/types";

export async function getConversations(filters?: { status?: ConversationStatus; search?: string }) {
  const conditions = [];
  if (filters?.status) conditions.push(eq(conversations.status, filters.status));
  if (filters?.search) conditions.push(sql`(${conversations.topic} LIKE ${'%' + filters.search + '%'} OR ${conversations.summary} LIKE ${'%' + filters.search + '%'})`);

  const allConvos = await db
    .select()
    .from(conversations)
    .where(conditions.length > 0 ? sql`${sql.join(conditions, sql` AND `)}` : undefined)
    .orderBy(
      asc(sql`CASE WHEN ${conversations.status} = 'resolved' THEN 1 ELSE 0 END`),
      desc(conversations.updatedAt)
    );

  const withDetails = await Promise.all(
    allConvos.map(async (convo) => {
      const [entryCount] = await db
        .select({ count: count() })
        .from(conversationEntries)
        .where(eq(conversationEntries.conversationId, convo.id));

      const [actionItemCount] = await db
        .select({ count: count() })
        .from(conversationEntries)
        .where(
          sql`${conversationEntries.conversationId} = ${convo.id} AND ${conversationEntries.entryType} = 'action-item'`
        );

      const linkedProjects = await db
        .select({ project: projects })
        .from(conversationProjects)
        .innerJoin(projects, eq(conversationProjects.projectId, projects.id))
        .where(eq(conversationProjects.conversationId, convo.id));

      return {
        ...convo,
        entryCount: entryCount?.count ?? 0,
        actionItemCount: actionItemCount?.count ?? 0,
        projects: linkedProjects.map((lp) => lp.project),
      };
    })
  );

  return withDetails;
}

export async function getConversationWithEntries(id: number) {
  const [convo] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, id));
  if (!convo) return null;

  const entries = await db
    .select()
    .from(conversationEntries)
    .where(eq(conversationEntries.conversationId, id))
    .orderBy(asc(conversationEntries.createdAt));

  const linkedProjects = await db
    .select({ project: projects })
    .from(conversationProjects)
    .innerJoin(projects, eq(conversationProjects.projectId, projects.id))
    .where(eq(conversationProjects.conversationId, id));

  const actionTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.conversationId, id));

  return {
    ...convo,
    entries,
    projects: linkedProjects.map((lp) => lp.project),
    actionTasks,
  };
}

export async function createConversation(data: {
  topic: string;
  summary?: string;
}) {
  const result = await db
    .insert(conversations)
    .values({
      topic: data.topic,
      summary: data.summary || null,
    })
    .returning();

  revalidatePath("/conversations");
  revalidatePath("/");
  return result[0];
}

export async function updateConversation(
  id: number,
  data: {
    topic?: string;
    summary?: string | null;
    status?: ConversationStatus;
  }
) {
  const result = await db
    .update(conversations)
    .set({
      ...data,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(conversations.id, id))
    .returning();

  revalidatePath("/conversations");
  revalidatePath(`/conversations/${id}`);
  revalidatePath("/");
  return result[0];
}

export async function deleteConversation(id: number) {
  await db.delete(conversations).where(eq(conversations.id, id));
  revalidatePath("/conversations");
  revalidatePath("/");
}

export async function addEntry(data: {
  conversationId: number;
  content: string;
  entryType: "note" | "action-item" | "decision" | "follow-up";
}) {
  const result = await db
    .insert(conversationEntries)
    .values(data)
    .returning();

  await db
    .update(conversations)
    .set({ updatedAt: new Date().toISOString() })
    .where(eq(conversations.id, data.conversationId));

  revalidatePath(`/conversations/${data.conversationId}`);
  revalidatePath("/conversations");
  return result[0];
}

export async function deleteEntry(id: number) {
  const [entry] = await db
    .select()
    .from(conversationEntries)
    .where(eq(conversationEntries.id, id));
  await db.delete(conversationEntries).where(eq(conversationEntries.id, id));
  if (entry) {
    revalidatePath(`/conversations/${entry.conversationId}`);
  }
  revalidatePath("/conversations");
}

export async function convertEntryToTask(
  entryId: number,
  conversationId: number
) {
  const [entry] = await db
    .select()
    .from(conversationEntries)
    .where(eq(conversationEntries.id, entryId));
  if (!entry) return null;

  const [task] = await db
    .insert(tasks)
    .values({
      title: entry.content.slice(0, 200),
      description: entry.content,
      conversationId,
      priority: "medium",
    })
    .returning();

  revalidatePath(`/conversations/${conversationId}`);
  revalidatePath("/tasks");
  revalidatePath("/");
  return task;
}

export async function linkProjectToConversation(
  conversationId: number,
  projectId: number
) {
  await db
    .insert(conversationProjects)
    .values({ conversationId, projectId })
    .onConflictDoNothing();
  revalidatePath(`/conversations/${conversationId}`);
  revalidatePath("/conversations");
}

export async function unlinkProjectFromConversation(
  conversationId: number,
  projectId: number
) {
  await db
    .delete(conversationProjects)
    .where(
      sql`${conversationProjects.conversationId} = ${conversationId} AND ${conversationProjects.projectId} = ${projectId}`
    );
  revalidatePath(`/conversations/${conversationId}`);
  revalidatePath("/conversations");
}
