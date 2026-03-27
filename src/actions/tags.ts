"use server";

import { db } from "@/db";
import { tags, entityTags } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getTags() {
  return db.select().from(tags).orderBy(tags.name);
}

export async function createTag(name: string, color: string) {
  const result = await db
    .insert(tags)
    .values({ name, color })
    .returning();
  return result[0];
}

export async function updateTag(id: number, data: { name?: string; color?: string }) {
  const result = await db.update(tags).set(data).where(eq(tags.id, id)).returning();
  revalidatePath("/tasks");
  revalidatePath("/projects");
  revalidatePath("/conversations");
  return result[0];
}

export async function deleteTag(id: number) {
  await db.delete(tags).where(eq(tags.id, id));
  revalidatePath("/tasks");
  revalidatePath("/projects");
  revalidatePath("/conversations");
  revalidatePath("/security");
  revalidatePath("/ai");
  revalidatePath("/vendors");
  revalidatePath("/risks");
  revalidatePath("/team");
}

export async function addTagToEntity(
  tagId: number,
  entityType: "task" | "project" | "conversation" | "security" | "ai" | "vendor" | "risk" | "team-member",
  entityId: number
) {
  await db
    .insert(entityTags)
    .values({ tagId, entityType, entityId })
    .onConflictDoNothing();
  revalidatePath("/tasks");
  revalidatePath("/projects");
  revalidatePath("/conversations");
  revalidatePath("/security");
  revalidatePath("/ai");
  revalidatePath("/vendors");
  revalidatePath("/risks");
  revalidatePath("/team");
}

export async function removeTagFromEntity(
  tagId: number,
  entityType: "task" | "project" | "conversation" | "security" | "ai" | "vendor" | "risk" | "team-member",
  entityId: number
) {
  await db
    .delete(entityTags)
    .where(
      sql`${entityTags.tagId} = ${tagId} AND ${entityTags.entityType} = ${entityType} AND ${entityTags.entityId} = ${entityId}`
    );
  revalidatePath("/tasks");
  revalidatePath("/projects");
  revalidatePath("/conversations");
  revalidatePath("/security");
  revalidatePath("/ai");
  revalidatePath("/vendors");
  revalidatePath("/risks");
  revalidatePath("/team");
}

export async function getTagsForEntity(
  entityType: "task" | "project" | "conversation" | "security" | "ai" | "vendor" | "risk" | "team-member",
  entityId: number
) {
  const result = await db
    .select({ tag: tags })
    .from(entityTags)
    .innerJoin(tags, eq(entityTags.tagId, tags.id))
    .where(
      sql`${entityTags.entityType} = ${entityType} AND ${entityTags.entityId} = ${entityId}`
    );
  return result.map((r) => r.tag);
}

export async function getTagsForEntities(
  entityType: "task" | "project" | "conversation" | "security" | "ai" | "vendor" | "risk" | "team-member",
  entityIds: number[]
) {
  if (entityIds.length === 0) return new Map<number, typeof tags.$inferSelect[]>();

  const result = await db
    .select({
      entityId: entityTags.entityId,
      tag: tags,
    })
    .from(entityTags)
    .innerJoin(tags, eq(entityTags.tagId, tags.id))
    .where(
      sql`${entityTags.entityType} = ${entityType} AND ${entityTags.entityId} IN (${sql.join(entityIds.map(id => sql`${id}`), sql`, `)})`
    );

  const map = new Map<number, typeof tags.$inferSelect[]>();
  for (const r of result) {
    const existing = map.get(r.entityId) || [];
    existing.push(r.tag);
    map.set(r.entityId, existing);
  }
  return map;
}
