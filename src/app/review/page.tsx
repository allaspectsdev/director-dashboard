import { Header } from "@/components/layout/header";
import { getWeeklyReview } from "@/actions/review";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityIndicator } from "@/components/shared/priority-indicator";
import { formatDateShort } from "@/lib/dates";
import { format, parseISO } from "date-fns";
import {
  CheckCircle2,
  PlusCircle,
  AlertTriangle,
  Diamond,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { CopyDigestButton } from "@/components/review/copy-digest-button";

interface Props {
  searchParams: Promise<{ week?: string }>;
}

export default async function ReviewPage({ searchParams }: Props) {
  const params = await searchParams;
  const weekOffset = params.week ? Number(params.week) : 0;
  const data = await getWeeklyReview(weekOffset);

  const weekLabel = `${format(parseISO(data.weekStart), "MMM d")} — ${format(parseISO(data.weekEnd), "MMM d, yyyy")}`;

  return (
    <div>
      <Header
        title="Weekly Review"
        description="Reflect on progress and plan ahead."
        serif
      >
        <CopyDigestButton digest={generateDigest(data, weekLabel)} />
      </Header>

      {/* Week picker */}
      <div className="mt-6 flex items-center gap-3 animate-fade-up stagger-1">
        <Link
          href={`/review?week=${weekOffset - 1}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-2 text-[14px] font-medium">
          <CalendarDays className="h-4 w-4 text-primary" />
          {weekLabel}
        </div>
        <Link
          href={weekOffset < 0 ? `/review?week=${weekOffset + 1}` : "/review"}
          className="flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-muted transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
        {weekOffset !== 0 && (
          <Link
            href="/review"
            className="text-[12px] text-primary hover:underline ml-2"
          >
            This week
          </Link>
        )}
      </div>

      {/* Stats bar */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 animate-fade-up stagger-2">
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={data.tasksCompleted.length}
          color="text-emerald-600 dark:text-emerald-400"
          bg="bg-emerald-500/10"
        />
        <StatCard
          icon={PlusCircle}
          label="Created"
          value={data.tasksCreated.length}
          color="text-sky-600 dark:text-sky-400"
          bg="bg-sky-500/10"
        />
        <StatCard
          icon={AlertTriangle}
          label="Overdue"
          value={data.tasksOverdue.length}
          color="text-red-600 dark:text-red-400"
          bg="bg-red-500/10"
        />
        <StatCard
          icon={Diamond}
          label="Milestones Hit"
          value={data.milestonesCompleted.length}
          color="text-violet-600 dark:text-violet-400"
          bg="bg-violet-500/10"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Completed this week */}
        <div className="animate-fade-up stagger-3">
          <h2 className="text-[14px] font-semibold mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Completed This Week
          </h2>
          {data.completedByProject.length === 0 ? (
            <p className="text-[13px] text-muted-foreground/50 py-6 text-center">
              No tasks completed yet this week.
            </p>
          ) : (
            <div className="space-y-4">
              {data.completedByProject.map(({ project, tasks }, i) => (
                <div key={i}>
                  <h3 className="text-[12px] font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    {project && (
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: project.color || "#6366f1" }}
                      />
                    )}
                    {project?.name || "No project"}
                  </h3>
                  <div className="space-y-1">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13px]"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="line-through text-muted-foreground">
                          {task.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming next week */}
        <div className="animate-fade-up stagger-4">
          <h2 className="text-[14px] font-semibold mb-3 flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-sky-500" />
            Coming Next Week
          </h2>
          {data.upcomingTasks.length === 0 && data.upcomingMilestones.length === 0 ? (
            <p className="text-[13px] text-muted-foreground/50 py-6 text-center">
              Nothing scheduled for next week.
            </p>
          ) : (
            <div className="space-y-1.5">
              {data.upcomingMilestones.map((ms) => (
                <div
                  key={`ms-${ms.id}`}
                  className="flex items-center gap-2 rounded-lg border border-violet-200/50 bg-violet-50/50 dark:border-violet-900/30 dark:bg-violet-950/20 px-3 py-2 text-[13px]"
                >
                  <Diamond className="h-3.5 w-3.5 text-violet-500 flex-shrink-0" />
                  <span className="font-medium">{ms.title}</span>
                  {ms.targetDate && (
                    <span className="ml-auto text-[11px] text-muted-foreground">
                      {formatDateShort(ms.targetDate)}
                    </span>
                  )}
                </div>
              ))}
              {data.upcomingTasks.map((task) => (
                <div
                  key={`task-${task.id}`}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px]"
                >
                  <PriorityIndicator priority={task.priority} />
                  <span className="font-medium">{task.title}</span>
                  {task.dueDate && (
                    <span className="ml-auto text-[11px] text-muted-foreground">
                      {formatDateShort(task.dueDate)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Overdue */}
        {data.tasksOverdue.length > 0 && (
          <div className="animate-fade-up stagger-5">
            <h2 className="text-[14px] font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Overdue
            </h2>
            <div className="space-y-1.5">
              {data.tasksOverdue.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 rounded-lg border border-red-200/50 bg-red-50/50 dark:border-red-900/30 dark:bg-red-950/20 px-3 py-2 text-[13px]"
                >
                  <PriorityIndicator priority={task.priority} />
                  <span className="font-medium">{task.title}</span>
                  <StatusBadge type="task" value={task.status} className="ml-auto" />
                  {task.dueDate && (
                    <span className="text-[11px] font-medium text-red-500">
                      {formatDateShort(task.dueDate)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function generateDigest(data: Awaited<ReturnType<typeof getWeeklyReview>>, weekLabel: string): string {
  const lines: string[] = [];
  lines.push(`Technology Update — ${weekLabel}`);
  lines.push("=".repeat(40));
  lines.push("");

  lines.push(`Summary: ${data.tasksCompleted.length} completed | ${data.tasksCreated.length} created | ${data.tasksOverdue.length} overdue | ${data.milestonesCompleted.length} milestones hit`);
  lines.push("");

  if (data.completedByProject.length > 0) {
    lines.push("COMPLETED THIS WEEK:");
    for (const { project, tasks } of data.completedByProject) {
      lines.push(`  ${project?.name || "General"}:`);
      for (const task of tasks) {
        lines.push(`    - ${task.title}`);
      }
    }
    lines.push("");
  }

  if (data.upcomingTasks.length > 0 || data.upcomingMilestones.length > 0) {
    lines.push("COMING NEXT WEEK:");
    for (const ms of data.upcomingMilestones) {
      lines.push(`  [Milestone] ${ms.title}${ms.targetDate ? ` (${formatDateShort(ms.targetDate)})` : ""}`);
    }
    for (const task of data.upcomingTasks) {
      lines.push(`  - ${task.title}${task.dueDate ? ` (${formatDateShort(task.dueDate)})` : ""}`);
    }
    lines.push("");
  }

  if (data.tasksOverdue.length > 0) {
    lines.push("NEEDS ATTENTION (Overdue):");
    for (const task of data.tasksOverdue) {
      lines.push(`  - ${task.title} (due ${formatDateShort(task.dueDate)})`);
    }
    lines.push("");
  }

  lines.push("— Ryan Decker, Director of Technology");
  return lines.join("\n");
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: typeof CheckCircle2;
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
        <div>
          <p className="text-[24px] font-bold tracking-tight leading-none">
            {value}
          </p>
          <p className="mt-1 text-[11px] font-medium text-muted-foreground">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}
