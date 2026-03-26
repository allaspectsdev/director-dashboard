export const PROJECT_STATUSES = [
  "planning",
  "active",
  "on-hold",
  "completed",
  "archived",
] as const;

export const TASK_STATUSES = ["todo", "in-progress", "done"] as const;

export const PRIORITIES = ["low", "medium", "high", "urgent"] as const;

export const MILESTONE_STATUSES = [
  "pending",
  "in-progress",
  "completed",
] as const;

export const GOAL_STATUSES = ["active", "completed", "abandoned"] as const;

export const CONVERSATION_STATUSES = ["open", "waiting", "resolved"] as const;

export const ENTRY_TYPES = [
  "note",
  "action-item",
  "decision",
  "follow-up",
] as const;

export const PROJECT_STATUS_COLORS: Record<string, string> = {
  planning: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  "on-hold": "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  completed: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  archived: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

export const TASK_STATUS_COLORS: Record<string, string> = {
  todo: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  "in-progress": "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};

export const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export const PRIORITY_DOT_COLORS: Record<string, string> = {
  low: "bg-gray-400",
  medium: "bg-blue-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
};

export const CONVERSATION_STATUS_COLORS: Record<string, string> = {
  open: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  waiting: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  resolved: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

export const MILESTONE_STATUS_COLORS: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  "in-progress": "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};

export const GOAL_STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  completed: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  abandoned: "bg-red-100 text-red-500 dark:bg-red-950 dark:text-red-400",
};

export const ENTRY_TYPE_COLORS: Record<string, string> = {
  note: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  "action-item": "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  decision: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  "follow-up": "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};

// ========== Security & Compliance ==========

export const SECURITY_CATEGORIES = [
  "incident", "vulnerability", "audit", "compliance", "policy", "training",
] as const;

export const SECURITY_SEVERITIES = [
  "critical", "high", "medium", "low", "info",
] as const;

export const SECURITY_STATUSES = [
  "open", "in-progress", "mitigated", "resolved", "accepted",
] as const;

export const SECURITY_SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  low: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  info: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

export const SECURITY_STATUS_COLORS: Record<string, string> = {
  open: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  "in-progress": "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  mitigated: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  accepted: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

export const SECURITY_CATEGORY_COLORS: Record<string, string> = {
  incident: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  vulnerability: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  audit: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  compliance: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  policy: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  training: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};

// ========== AI Initiatives ==========

export const AI_CATEGORIES = [
  "production", "pilot", "experiment", "research", "tool",
] as const;

export const AI_STATUSES = [
  "ideation", "development", "testing", "deployed", "retired",
] as const;

export const AI_STATUS_COLORS: Record<string, string> = {
  ideation: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  development: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  testing: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  deployed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  retired: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

export const AI_CATEGORY_COLORS: Record<string, string> = {
  production: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  pilot: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  experiment: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  research: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  tool: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};

// ========== Vendors ==========

export const VENDOR_CATEGORIES = [
  "saas", "infrastructure", "security", "ai-ml", "consulting", "hardware", "other",
] as const;

export const VENDOR_STATUSES = [
  "active", "evaluating", "inactive", "cancelled",
] as const;

export const VENDOR_STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  evaluating: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  inactive: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  cancelled: "bg-red-100 text-red-500 dark:bg-red-950 dark:text-red-400",
};

// ========== Team ==========

export const TEAM_DEPARTMENTS = [
  "it", "security", "ai", "engineering", "other",
] as const;

export const TEAM_MEMBER_STATUSES = [
  "active", "on-leave", "offboarded",
] as const;

export const MOOD_COLORS: Record<string, string> = {
  great: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  good: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  okay: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  struggling: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

// ========== Risk Register ==========

export const RISK_CATEGORIES = [
  "operational", "security", "compliance", "financial", "strategic", "technology",
] as const;

export const RISK_STATUSES = [
  "identified", "assessing", "mitigating", "monitoring", "closed",
] as const;

export const RISK_STATUS_COLORS: Record<string, string> = {
  identified: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  assessing: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  mitigating: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  monitoring: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  closed: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

export const RISK_CATEGORY_COLORS: Record<string, string> = {
  operational: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  security: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  compliance: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  financial: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  strategic: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  technology: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
};

export function getRiskLevel(likelihood: number, impact: number): { label: string; color: string } {
  const score = likelihood * impact;
  if (score >= 20) return { label: "Critical", color: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950" };
  if (score >= 12) return { label: "High", color: "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950" };
  if (score >= 6) return { label: "Medium", color: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950" };
  return { label: "Low", color: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950" };
}

export const PROJECT_COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#f43f5e", // rose
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#a855f7", // purple
];
