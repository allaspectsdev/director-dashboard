import { FolderKanban, CheckSquare, Target, MessageSquare, AlertTriangle, Clock } from "lucide-react";

interface StatsCardsProps {
  activeProjects: number;
  openTasks: number;
  activeGoals: number;
  openConversations: number;
  overdueTasks?: number;
  dueTodayTasks?: number;
}

const stats = [
  {
    key: "activeProjects",
    label: "Active Projects",
    icon: FolderKanban,
    gradient: "from-indigo-500/10 to-violet-500/10 dark:from-indigo-500/15 dark:to-violet-500/15",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    borderAccent: "border-indigo-200/60 dark:border-indigo-500/15",
  },
  {
    key: "openTasks",
    label: "Open Tasks",
    icon: CheckSquare,
    gradient: "from-sky-500/10 to-cyan-500/10 dark:from-sky-500/15 dark:to-cyan-500/15",
    iconColor: "text-sky-600 dark:text-sky-400",
    borderAccent: "border-sky-200/60 dark:border-sky-500/15",
  },
  {
    key: "activeGoals",
    label: "Active Goals",
    icon: Target,
    gradient: "from-violet-500/10 to-fuchsia-500/10 dark:from-violet-500/15 dark:to-fuchsia-500/15",
    iconColor: "text-violet-600 dark:text-violet-400",
    borderAccent: "border-violet-200/60 dark:border-violet-500/15",
  },
  {
    key: "openConversations",
    label: "Open Threads",
    icon: MessageSquare,
    gradient: "from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/15 dark:to-teal-500/15",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    borderAccent: "border-emerald-200/60 dark:border-emerald-500/15",
  },
] as const;

export function StatsCards(props: StatsCardsProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.key}
            className={`relative overflow-hidden rounded-xl border ${stat.borderAccent} bg-gradient-to-br ${stat.gradient} p-4 transition-all duration-300 hover:scale-[1.02]`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[32px] font-bold tracking-tight leading-none">
                  {props[stat.key]}
                </p>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
              </div>
              <div className={`${stat.iconColor} opacity-60`}>
                <stat.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {((props.overdueTasks ?? 0) > 0 || (props.dueTodayTasks ?? 0) > 0) && (
        <div className="flex gap-3">
          {(props.overdueTasks ?? 0) > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200/60 dark:border-red-500/20 bg-red-50/50 dark:bg-red-950/20 px-3 py-2">
              <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
              <span className="text-[12px] font-medium text-red-600 dark:text-red-400">
                {props.overdueTasks} overdue {props.overdueTasks === 1 ? "task" : "tasks"}
              </span>
            </div>
          )}
          {(props.dueTodayTasks ?? 0) > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200/60 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20 px-3 py-2">
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-[12px] font-medium text-amber-600 dark:text-amber-400">
                {props.dueTodayTasks} due today
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
