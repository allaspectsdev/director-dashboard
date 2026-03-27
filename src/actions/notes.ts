"use server";

import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq, desc, asc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getNotes(filters?: { search?: string; pinned?: boolean }) {
  const conditions = [];
  if (filters?.search) conditions.push(sql`(${notes.title} LIKE ${'%' + filters.search + '%'} OR ${notes.content} LIKE ${'%' + filters.search + '%'})`);
  if (filters?.pinned) conditions.push(eq(notes.isPinned, true));

  return db
    .select()
    .from(notes)
    .where(conditions.length > 0 ? sql`${sql.join(conditions, sql` AND `)}` : undefined)
    .orderBy(
      desc(sql`${notes.isPinned}`),
      desc(notes.updatedAt)
    );
}

export async function createNote(data: {
  title?: string;
  content: string;
  projectId?: number | null;
}) {
  const result = await db
    .insert(notes)
    .values({
      title: data.title || null,
      content: data.content,
      projectId: data.projectId || null,
    })
    .returning();

  revalidatePath("/notes");
  return result[0];
}

export async function updateNote(
  id: number,
  data: {
    title?: string | null;
    content?: string;
    projectId?: number | null;
  }
) {
  const result = await db
    .update(notes)
    .set({
      ...data,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(notes.id, id))
    .returning();

  revalidatePath("/notes");
  return result[0];
}

export async function toggleNotePin(id: number) {
  const [note] = await db.select().from(notes).where(eq(notes.id, id));
  if (!note) return null;

  const result = await db
    .update(notes)
    .set({
      isPinned: !note.isPinned,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(notes.id, id))
    .returning();

  revalidatePath("/notes");
  return result[0];
}

export async function deleteNote(id: number) {
  await db.delete(notes).where(eq(notes.id, id));
  revalidatePath("/notes");
}
