import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
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
  tags,
  entityTags,
  taskDependencies,
} from "@/db/schema";

export type Project = InferSelectModel<typeof projects>;
export type NewProject = InferInsertModel<typeof projects>;

export type Milestone = InferSelectModel<typeof milestones>;
export type NewMilestone = InferInsertModel<typeof milestones>;

export type Task = InferSelectModel<typeof tasks>;
export type NewTask = InferInsertModel<typeof tasks>;

export type Goal = InferSelectModel<typeof goals>;
export type NewGoal = InferInsertModel<typeof goals>;

export type GoalProject = InferSelectModel<typeof goalProjects>;
export type GoalMilestone = InferSelectModel<typeof goalMilestones>;

export type Conversation = InferSelectModel<typeof conversations>;
export type NewConversation = InferInsertModel<typeof conversations>;

export type ConversationEntry = InferSelectModel<typeof conversationEntries>;
export type NewConversationEntry = InferInsertModel<typeof conversationEntries>;

export type ConversationProject = InferSelectModel<typeof conversationProjects>;

export type Note = InferSelectModel<typeof notes>;
export type NewNote = InferInsertModel<typeof notes>;

export type ProjectStatus = Project["status"];
export type TaskStatus = Task["status"];
export type TaskPriority = Task["priority"];
export type MilestoneStatus = Milestone["status"];
export type GoalStatus = Goal["status"];
export type ConversationStatus = Conversation["status"];
export type EntryType = ConversationEntry["entryType"];

export type Tag = InferSelectModel<typeof tags>;
export type NewTag = InferInsertModel<typeof tags>;
export type EntityTag = InferSelectModel<typeof entityTags>;
export type TaskDependency = InferSelectModel<typeof taskDependencies>;
