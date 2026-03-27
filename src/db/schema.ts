import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status", {
    enum: ["planning", "active", "on-hold", "completed", "archived"],
  })
    .notNull()
    .default("active"),
  priority: text("priority", {
    enum: ["low", "medium", "high", "urgent"],
  })
    .notNull()
    .default("medium"),
  startDate: text("start_date"),
  targetDate: text("target_date"),
  completedDate: text("completed_date"),
  color: text("color"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const milestones = sqliteTable("milestones", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  targetDate: text("target_date"),
  completedDate: text("completed_date"),
  status: text("status", {
    enum: ["pending", "in-progress", "completed"],
  })
    .notNull()
    .default("pending"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const conversations = sqliteTable("conversations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  topic: text("topic").notNull(),
  status: text("status", {
    enum: ["open", "waiting", "resolved"],
  })
    .notNull()
    .default("open"),
  summary: text("summary"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", {
    enum: ["todo", "in-progress", "done"],
  })
    .notNull()
    .default("todo"),
  priority: text("priority", {
    enum: ["low", "medium", "high", "urgent"],
  })
    .notNull()
    .default("medium"),
  dueDate: text("due_date"),
  completedDate: text("completed_date"),
  projectId: integer("project_id").references(() => projects.id, {
    onDelete: "set null",
  }),
  milestoneId: integer("milestone_id").references(() => milestones.id, {
    onDelete: "set null",
  }),
  conversationId: integer("conversation_id").references(
    () => conversations.id,
    { onDelete: "set null" }
  ),
  sortOrder: integer("sort_order").notNull().default(0),
  recurrenceRule: text("recurrence_rule"),
  recurrenceSourceId: integer("recurrence_source_id"),
  isRecurring: integer("is_recurring", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const goals = sqliteTable("goals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  trackingType: text("tracking_type", {
    enum: ["percentage", "milestone"],
  })
    .notNull()
    .default("percentage"),
  progressPercentage: integer("progress_percentage").notNull().default(0),
  status: text("status", {
    enum: ["active", "completed", "abandoned"],
  })
    .notNull()
    .default("active"),
  targetDate: text("target_date"),
  completedDate: text("completed_date"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const goalProjects = sqliteTable(
  "goal_projects",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    goalId: integer("goal_id")
      .notNull()
      .references(() => goals.id, { onDelete: "cascade" }),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("goal_projects_unique").on(table.goalId, table.projectId),
  ]
);

export const goalMilestones = sqliteTable(
  "goal_milestones",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    goalId: integer("goal_id")
      .notNull()
      .references(() => goals.id, { onDelete: "cascade" }),
    milestoneId: integer("milestone_id")
      .notNull()
      .references(() => milestones.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("goal_milestones_unique").on(table.goalId, table.milestoneId),
  ]
);

export const conversationEntries = sqliteTable("conversation_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  conversationId: integer("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  entryType: text("entry_type", {
    enum: ["note", "action-item", "decision", "follow-up"],
  })
    .notNull()
    .default("note"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const conversationProjects = sqliteTable(
  "conversation_projects",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    conversationId: integer("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("conversation_projects_unique").on(
      table.conversationId,
      table.projectId
    ),
  ]
);

export const tags = sqliteTable("tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  color: text("color").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const entityTags = sqliteTable(
  "entity_tags",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    entityType: text("entity_type", {
      enum: ["task", "project", "conversation", "security", "ai", "vendor", "risk", "team-member"],
    }).notNull(),
    entityId: integer("entity_id").notNull(),
  },
  (table) => [
    uniqueIndex("entity_tags_unique").on(
      table.tagId,
      table.entityType,
      table.entityId
    ),
  ]
);

export const taskDependencies = sqliteTable(
  "task_dependencies",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    taskId: integer("task_id")
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    blockedByTaskId: integer("blocked_by_task_id")
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => [
    uniqueIndex("task_dependencies_unique").on(
      table.taskId,
      table.blockedByTaskId
    ),
  ]
);

// ========== Security & Compliance ==========

export const securityItems = sqliteTable("security_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category", {
    enum: ["incident", "vulnerability", "audit", "compliance", "policy", "training"],
  }).notNull().default("compliance"),
  severity: text("severity", {
    enum: ["critical", "high", "medium", "low", "info"],
  }).notNull().default("medium"),
  status: text("status", {
    enum: ["open", "in-progress", "mitigated", "resolved", "accepted"],
  }).notNull().default("open"),
  framework: text("framework"), // e.g. HIPAA, SOC2, NIST, ISO27001
  dueDate: text("due_date"),
  resolvedDate: text("resolved_date"),
  assignee: text("assignee"),
  projectId: integer("project_id").references(() => projects.id, { onDelete: "set null" }),
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

// ========== AI Initiatives ==========

export const aiInitiatives = sqliteTable("ai_initiatives", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category", {
    enum: ["production", "pilot", "experiment", "research", "tool"],
  }).notNull().default("experiment"),
  status: text("status", {
    enum: ["ideation", "development", "testing", "deployed", "retired"],
  }).notNull().default("ideation"),
  model: text("model"), // e.g. GPT-4, Claude, custom model
  department: text("department"), // which team uses this
  impact: text("impact"), // description of business impact
  roiEstimate: text("roi_estimate"),
  vendorId: integer("vendor_id").references(() => vendors.id, { onDelete: "set null" }),
  projectId: integer("project_id").references(() => projects.id, { onDelete: "set null" }),
  startDate: text("start_date"),
  launchDate: text("launch_date"),
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

// ========== Vendors & Budget ==========

export const vendors = sqliteTable("vendors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category", {
    enum: ["saas", "infrastructure", "security", "ai-ml", "consulting", "hardware", "other"],
  }).notNull().default("saas"),
  status: text("status", {
    enum: ["active", "evaluating", "inactive", "cancelled"],
  }).notNull().default("active"),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  website: text("website"),
  contractStart: text("contract_start"),
  contractEnd: text("contract_end"),
  annualCost: integer("annual_cost"), // in cents for precision
  monthlyCost: integer("monthly_cost"),
  notes: text("notes"),
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

// ========== Team & 1:1s ==========

export const teamMembers = sqliteTable("team_members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  role: text("role").notNull(),
  department: text("department", {
    enum: ["it", "security", "ai", "engineering", "other"],
  }).notNull().default("it"),
  email: text("email"),
  startDate: text("start_date"),
  status: text("status", {
    enum: ["active", "on-leave", "offboarded"],
  }).notNull().default("active"),
  notes: text("notes"),
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export const oneOnOnes = sqliteTable("one_on_ones", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teamMemberId: integer("team_member_id")
    .notNull()
    .references(() => teamMembers.id, { onDelete: "cascade" }),
  meetingDate: text("meeting_date").notNull(),
  mood: text("mood", {
    enum: ["great", "good", "okay", "struggling"],
  }),
  notes: text("notes"),
  actionItems: text("action_items"), // JSON array of action items
  followUps: text("follow_ups"), // JSON array of follow-up items
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

// ========== Risk Register ==========

export const risks = sqliteTable("risks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category", {
    enum: ["operational", "security", "compliance", "financial", "strategic", "technology"],
  }).notNull().default("operational"),
  likelihood: integer("likelihood").notNull().default(3), // 1-5
  impact: integer("impact").notNull().default(3), // 1-5
  status: text("status", {
    enum: ["identified", "assessing", "mitigating", "monitoring", "closed"],
  }).notNull().default("identified"),
  mitigationPlan: text("mitigation_plan"),
  owner: text("owner"),
  projectId: integer("project_id").references(() => projects.id, { onDelete: "set null" }),
  reviewDate: text("review_date"),
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

// ========== Notes (existing) ==========

export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title"),
  content: text("content").notNull(),
  isPinned: integer("is_pinned", { mode: "boolean" }).notNull().default(false),
  projectId: integer("project_id").references(() => projects.id, {
    onDelete: "set null",
  }),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});
