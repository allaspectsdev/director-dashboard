import { Header } from "@/components/layout/header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentTasks } from "@/components/dashboard/recent-tasks";
import { ActiveProjects } from "@/components/dashboard/active-projects";
import { GoalsProgress } from "@/components/dashboard/goals-progress";
import { RecentConversations } from "@/components/dashboard/recent-conversations";
import { QuickAdd } from "@/components/dashboard/quick-add";
import { db } from "@/db";
import { projects, tasks, goals, conversations } from "@/db/schema";
import { eq, sql, count, asc, desc } from "drizzle-orm";
import { AlertTriangle, Clock } from "lucide-react";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

async function getDashboardData() {
  const [projectStats] = await db
    .select({ count: count() })
    .from(projects)
    .where(eq(projects.status, "active"));

  const [taskStats] = await db
    .select({ count: count() })
    .from(tasks)
    .where(sql`${tasks.status} != 'done'`);

  const [goalStats] = await db
    .select({ count: count() })
    .from(goals)
    .where(eq(goals.status, "active"));

  const [convoStats] = await db
    .select({ count: count() })
    .from(conversations)
    .where(sql`${conversations.status} != 'resolved'`);

  const [overdueStats] = await db
    .select({ count: count() })
    .from(tasks)
    .where(
      sql`${tasks.status} != 'done' AND ${tasks.dueDate} IS NOT NULL AND ${tasks.dueDate} < date('now')`
    );

  const [dueTodayStats] = await db
    .select({ count: count() })
    .from(tasks)
    .where(
      sql`${tasks.status} != 'done' AND ${tasks.dueDate} = date('now')`
    );

  const upcomingTasks = await db
    .select()
    .from(tasks)
    .where(sql`${tasks.status} != 'done'`)
    .orderBy(
      asc(tasks.dueDate),
      desc(
        sql`CASE ${tasks.priority} WHEN 'urgent' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END`
      )
    )
    .limit(5);

  const activeProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.status, "active"))
    .orderBy(desc(projects.updatedAt))
    .limit(5);

  const activeProjectsWithStats = await Promise.all(
    activeProjects.map(async (project) => {
      const [stats] = await db
        .select({
          total: count(),
          completed: count(
            sql`CASE WHEN ${tasks.status} = 'done' THEN 1 END`
          ),
        })
        .from(tasks)
        .where(eq(tasks.projectId, project.id));

      return {
        project,
        taskCount: stats?.total ?? 0,
        taskCompleted: stats?.completed ?? 0,
      };
    })
  );

  const activeGoals = await db
    .select()
    .from(goals)
    .where(eq(goals.status, "active"))
    .limit(5);

  const goalsWithProgress = activeGoals.map((goal) => ({
    id: goal.id,
    title: goal.title,
    computedProgress: goal.progressPercentage,
  }));

  const recentConvos = await db
    .select()
    .from(conversations)
    .where(sql`${conversations.status} != 'resolved'`)
    .orderBy(desc(conversations.updatedAt))
    .limit(5);

  return {
    stats: {
      activeProjects: projectStats?.count ?? 0,
      openTasks: taskStats?.count ?? 0,
      activeGoals: goalStats?.count ?? 0,
      openConversations: convoStats?.count ?? 0,
      overdueTasks: overdueStats?.count ?? 0,
      dueTodayTasks: dueTodayStats?.count ?? 0,
    },
    upcomingTasks,
    activeProjectsWithStats,
    goalsWithProgress,
    recentConvos,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  const greeting = getGreeting();

  return (
    <div>
      <Header
        title={`${greeting}, Ryan`}
        description="Here's what needs your attention today."
        serif
      />

      <div className="mt-8 space-y-8">
        <div className="animate-fade-up stagger-1">
          <QuickAdd />
        </div>

        <div className="animate-fade-up stagger-2">
          <StatsCards {...data.stats} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-6">
            <div className="animate-fade-up stagger-3">
              <RecentTasks tasks={data.upcomingTasks} />
            </div>
            <div className="animate-fade-up stagger-5">
              <RecentConversations conversations={data.recentConvos} />
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="animate-fade-up stagger-4">
              <ActiveProjects projects={data.activeProjectsWithStats} />
            </div>
            <div className="animate-fade-up stagger-6">
              <GoalsProgress goals={data.goalsWithProgress} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
