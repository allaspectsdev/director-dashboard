import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(["todo", "in-progress", "done"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  dueDate: z.string().optional(),
  projectId: z.number().nullable().optional(),
});

export const projectSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(["planning", "active", "on-hold", "completed", "archived"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  startDate: z.string().optional(),
  targetDate: z.string().optional(),
  color: z.string().optional(),
});

export const goalSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(["active", "completed", "abandoned"]),
  trackingType: z.enum(["percentage", "milestone"]),
  targetDate: z.string().optional(),
});

export const securitySchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  category: z.enum(["incident", "vulnerability", "audit", "compliance", "policy", "training"]),
  severity: z.enum(["critical", "high", "medium", "low", "info"]),
  status: z.enum(["open", "in-progress", "mitigated", "resolved", "accepted"]),
  framework: z.string().max(100).optional(),
  dueDate: z.string().optional(),
  assignee: z.string().max(100).optional(),
});

export const aiSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(2000).optional(),
  category: z.enum(["production", "pilot", "experiment", "research", "tool"]),
  status: z.enum(["ideation", "development", "testing", "deployed", "retired"]),
  model: z.string().max(100).optional(),
  department: z.string().max(100).optional(),
  impact: z.string().max(1000).optional(),
  roiEstimate: z.string().max(50).optional(),
});

export const vendorSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(2000).optional(),
  category: z.enum(["saas", "infrastructure", "security", "ai-ml", "consulting", "hardware", "other"]),
  status: z.enum(["active", "evaluating", "inactive", "cancelled"]),
  contactName: z.string().max(100).optional(),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  annualCost: z.number().min(0).optional(),
  monthlyCost: z.number().min(0).optional(),
});

export const riskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  category: z.enum(["operational", "security", "compliance", "financial", "strategic", "technology"]),
  likelihood: z.number().min(1).max(5),
  impact: z.number().min(1).max(5),
  status: z.enum(["identified", "assessing", "mitigating", "monitoring", "closed"]),
  mitigationPlan: z.string().max(2000).optional(),
  owner: z.string().max(100).optional(),
  reviewDate: z.string().optional(),
});

export const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  role: z.string().min(1, "Role is required").max(100),
  department: z.enum(["it", "security", "ai", "engineering", "other"]),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
});

export const oneOnOneSchema = z.object({
  meetingDate: z.string().min(1, "Meeting date is required"),
  mood: z.enum(["great", "good", "okay", "struggling"]).optional(),
  notes: z.string().max(5000).optional(),
  actionItems: z.string().max(2000).optional(),
  followUps: z.string().max(2000).optional(),
});

export const conversationSchema = z.object({
  topic: z.string().min(1, "Topic is required").max(200),
  summary: z.string().max(2000).optional(),
  status: z.enum(["open", "waiting", "resolved"]),
});
