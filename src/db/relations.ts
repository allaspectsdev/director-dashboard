import { relations } from "drizzle-orm";
import {
  projects,
  milestones,
  tasks,
  goals,
  goalProjects,
  goalMilestones,
  conversations,
  conversationEntries,
  conversationProjects,
  notes,
} from "./schema";

export const projectsRelations = relations(projects, ({ many }) => ({
  milestones: many(milestones),
  tasks: many(tasks),
  notes: many(notes),
  goalProjects: many(goalProjects),
  conversationProjects: many(conversationProjects),
}));

export const milestonesRelations = relations(milestones, ({ one, many }) => ({
  project: one(projects, {
    fields: [milestones.projectId],
    references: [projects.id],
  }),
  tasks: many(tasks),
  goalMilestones: many(goalMilestones),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  milestone: one(milestones, {
    fields: [tasks.milestoneId],
    references: [milestones.id],
  }),
  conversation: one(conversations, {
    fields: [tasks.conversationId],
    references: [conversations.id],
  }),
}));

export const goalsRelations = relations(goals, ({ many }) => ({
  goalProjects: many(goalProjects),
  goalMilestones: many(goalMilestones),
}));

export const goalProjectsRelations = relations(goalProjects, ({ one }) => ({
  goal: one(goals, {
    fields: [goalProjects.goalId],
    references: [goals.id],
  }),
  project: one(projects, {
    fields: [goalProjects.projectId],
    references: [projects.id],
  }),
}));

export const goalMilestonesRelations = relations(
  goalMilestones,
  ({ one }) => ({
    goal: one(goals, {
      fields: [goalMilestones.goalId],
      references: [goals.id],
    }),
    milestone: one(milestones, {
      fields: [goalMilestones.milestoneId],
      references: [milestones.id],
    }),
  })
);

export const conversationsRelations = relations(
  conversations,
  ({ many }) => ({
    entries: many(conversationEntries),
    tasks: many(tasks),
    conversationProjects: many(conversationProjects),
  })
);

export const conversationEntriesRelations = relations(
  conversationEntries,
  ({ one }) => ({
    conversation: one(conversations, {
      fields: [conversationEntries.conversationId],
      references: [conversations.id],
    }),
  })
);

export const conversationProjectsRelations = relations(
  conversationProjects,
  ({ one }) => ({
    conversation: one(conversations, {
      fields: [conversationProjects.conversationId],
      references: [conversations.id],
    }),
    project: one(projects, {
      fields: [conversationProjects.projectId],
      references: [projects.id],
    }),
  })
);

export const notesRelations = relations(notes, ({ one }) => ({
  project: one(projects, {
    fields: [notes.projectId],
    references: [projects.id],
  }),
}));
