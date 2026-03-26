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
