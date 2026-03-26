"use server";

import { db } from "@/db";
import { tasks, projects, conversations, notes } from "@/db/schema";
import { like, sql } from "drizzle-orm";

export async function globalSearch(query: string) {
  if (!query || query.length < 2) return { tasks: [], projects: [], conversations: [], notes: [] };

  const pattern = `%${query}%`;

  const [matchedTasks, matchedProjects, matchedConversations, matchedNotes] = await Promise.all([
    db
      .select()
      .from(tasks)
      .where(sql`(${tasks.title} LIKE ${pattern} OR ${tasks.description} LIKE ${pattern})`)
      .limit(5),
    db
      .select()
      .from(projects)
      .where(sql`(${projects.name} LIKE ${pattern} OR ${projects.description} LIKE ${pattern})`)
      .limit(5),
    db
      .select()
      .from(conversations)
      .where(sql`(${conversations.topic} LIKE ${pattern} OR ${conversations.summary} LIKE ${pattern})`)
      .limit(5),
    db
      .select()
      .from(notes)
      .where(sql`(${notes.title} LIKE ${pattern} OR ${notes.content} LIKE ${pattern})`)
      .limit(5),
  ]);

  return {
    tasks: matchedTasks,
    projects: matchedProjects,
    conversations: matchedConversations,
    notes: matchedNotes,
  };
}
