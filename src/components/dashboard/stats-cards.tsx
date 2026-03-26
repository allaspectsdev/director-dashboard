import { FolderKanban, CheckSquare, Target, MessageSquare } from "lucide-react";

interface StatsCardsProps {
  activeProjects: number;
  openTasks: number;
  activeGoals: number;
  openConversations: number;
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
  );
}
