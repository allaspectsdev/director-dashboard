"use server";

import { db } from "@/db";
import { tasks, projects, conversations, notes, securityItems, aiInitiatives, vendors, teamMembers, risks } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function globalSearch(query: string) {
  if (!query || query.length < 2) return {
    tasks: [], projects: [], conversations: [], notes: [],
    securityItems: [], aiInitiatives: [], vendors: [], teamMembers: [], risks: [],
  };

  const pattern = `%${query}%`;

  const [
    matchedTasks,
    matchedProjects,
    matchedConversations,
    matchedNotes,
    matchedSecurity,
    matchedAi,
    matchedVendors,
    matchedTeam,
    matchedRisks,
  ] = await Promise.all([
    db.select().from(tasks)
      .where(sql`(${tasks.title} LIKE ${pattern} OR ${tasks.description} LIKE ${pattern})`)
      .limit(5),
    db.select().from(projects)
      .where(sql`(${projects.name} LIKE ${pattern} OR ${projects.description} LIKE ${pattern})`)
      .limit(5),
    db.select().from(conversations)
      .where(sql`(${conversations.topic} LIKE ${pattern} OR ${conversations.summary} LIKE ${pattern})`)
      .limit(5),
    db.select().from(notes)
      .where(sql`(${notes.title} LIKE ${pattern} OR ${notes.content} LIKE ${pattern})`)
      .limit(5),
    db.select().from(securityItems)
      .where(sql`(${securityItems.title} LIKE ${pattern} OR ${securityItems.description} LIKE ${pattern})`)
      .limit(5),
    db.select().from(aiInitiatives)
      .where(sql`(${aiInitiatives.name} LIKE ${pattern} OR ${aiInitiatives.description} LIKE ${pattern})`)
      .limit(5),
    db.select().from(vendors)
      .where(sql`(${vendors.name} LIKE ${pattern} OR ${vendors.description} LIKE ${pattern})`)
      .limit(5),
    db.select().from(teamMembers)
      .where(sql`(${teamMembers.name} LIKE ${pattern} OR ${teamMembers.role} LIKE ${pattern})`)
      .limit(5),
    db.select().from(risks)
      .where(sql`(${risks.title} LIKE ${pattern} OR ${risks.description} LIKE ${pattern})`)
      .limit(5),
  ]);

  return {
    tasks: matchedTasks,
    projects: matchedProjects,
    conversations: matchedConversations,
    notes: matchedNotes,
    securityItems: matchedSecurity,
    aiInitiatives: matchedAi,
    vendors: matchedVendors,
    teamMembers: matchedTeam,
    risks: matchedRisks,
  };
}
