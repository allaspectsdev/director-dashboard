import { Header } from "@/components/layout/header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentTasks } from "@/components/dashboard/recent-tasks";
import { ActiveProjects } from "@/components/dashboard/active-projects";
import { GoalsProgress } from "@/components/dashboard/goals-progress";
import { RecentConversations } from "@/components/dashboard/recent-conversations";
import { SecuritySummary } from "@/components/dashboard/security-summary";
import { AiSummary } from "@/components/dashboard/ai-summary";
import { VendorSummary } from "@/components/dashboard/vendor-summary";
import { TeamSummary } from "@/components/dashboard/team-summary";
import { RiskSummary } from "@/components/dashboard/risk-summary";
import { TaskTrendChart } from "@/components/dashboard/task-trend-chart";
import { QuickAdd } from "@/components/dashboard/quick-add";
import { db } from "@/db";
import { projects, tasks, goals, conversations, securityItems, aiInitiatives, vendors, teamMembers, risks } from "@/db/schema";
import { eq, sql, count, asc, desc, sum } from "drizzle-orm";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

async function getDashboardData() {
  // Core stats
  const [projectStats, taskStats, goalStats, convoStats, overdueStats, dueTodayStats] =
    await Promise.all([
      db.select({ count: count() }).from(projects).where(eq(projects.status, "active")),
      db.select({ count: count() }).from(tasks).where(sql`${tasks.status} != 'done'`),
      db.select({ count: count() }).from(goals).where(eq(goals.status, "active")),
      db.select({ count: count() }).from(conversations).where(sql`${conversations.status} != 'resolved'`),
      db.select({ count: count() }).from(tasks).where(sql`${tasks.status} != 'done' AND ${tasks.dueDate} IS NOT NULL AND ${tasks.dueDate} < date('now')`),
      db.select({ count: count() }).from(tasks).where(sql`${tasks.status} != 'done' AND ${tasks.dueDate} = date('now')`),
    ]);

  // Tasks & Projects
  const [upcomingTasks, activeProjects, activeGoals, recentConvos] = await Promise.all([
    db.select().from(tasks)
      .where(sql`${tasks.status} != 'done'`)
      .orderBy(asc(tasks.dueDate), desc(sql`CASE ${tasks.priority} WHEN 'urgent' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END`))
      .limit(5),
    db.select().from(projects).where(eq(projects.status, "active")).orderBy(desc(projects.updatedAt)).limit(5),
    db.select().from(goals).where(eq(goals.status, "active")).limit(5),
    db.select().from(conversations).where(sql`${conversations.status} != 'resolved'`).orderBy(desc(conversations.updatedAt)).limit(3),
  ]);

  const activeProjectsWithStats = await Promise.all(
    activeProjects.map(async (project) => {
      const [stats] = await db
        .select({ total: count(), completed: count(sql`CASE WHEN ${tasks.status} = 'done' THEN 1 END`) })
        .from(tasks)
        .where(eq(tasks.projectId, project.id));
      return { project, taskCount: stats?.total ?? 0, taskCompleted: stats?.completed ?? 0 };
    })
  );

  // Security data
  const [secOpenCritical, secOpenHigh, secTotalOpen, openSecItems] = await Promise.all([
    db.select({ count: count() }).from(securityItems).where(sql`${securityItems.status} NOT IN ('resolved', 'accepted') AND ${securityItems.severity} = 'critical'`),
    db.select({ count: count() }).from(securityItems).where(sql`${securityItems.status} NOT IN ('resolved', 'accepted') AND ${securityItems.severity} = 'high'`),
    db.select({ count: count() }).from(securityItems).where(sql`${securityItems.status} NOT IN ('resolved', 'accepted')`),
    db.select().from(securityItems).where(sql`${securityItems.status} NOT IN ('resolved', 'accepted')`).orderBy(sql`CASE ${securityItems.severity} WHEN 'critical' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 WHEN 'info' THEN 4 END`).limit(5),
  ]);

  // AI data
  const [aiDeployed, aiInDev, aiTotal, recentAi] = await Promise.all([
    db.select({ count: count() }).from(aiInitiatives).where(eq(aiInitiatives.status, "deployed")),
    db.select({ count: count() }).from(aiInitiatives).where(sql`${aiInitiatives.status} IN ('development', 'testing')`),
    db.select({ count: count() }).from(aiInitiatives),
    db.select().from(aiInitiatives).where(sql`${aiInitiatives.status} != 'retired'`).orderBy(desc(aiInitiatives.updatedAt)).limit(5),
  ]);

  // Vendor data
  const [vendorActive, vendorSpend] = await Promise.all([
    db.select({ count: count() }).from(vendors).where(eq(vendors.status, "active")),
    db.select({ total: sum(vendors.annualCost) }).from(vendors).where(eq(vendors.status, "active")),
  ]);

  const upcomingRenewals = await db.select().from(vendors)
    .where(sql`${vendors.status} = 'active' AND ${vendors.contractEnd} IS NOT NULL AND ${vendors.contractEnd} <= date('now', '+90 days') AND ${vendors.contractEnd} >= date('now')`)
    .orderBy(vendors.contractEnd).limit(5);

  // Team data
  const [teamActive] = await db.select({ count: count() }).from(teamMembers).where(eq(teamMembers.status, "active"));

  const teamByDept = await db
    .select({ department: teamMembers.department, count: count() })
    .from(teamMembers)
    .where(eq(teamMembers.status, "active"))
    .groupBy(teamMembers.department);

  return {
    stats: {
      activeProjects: projectStats[0]?.count ?? 0,
      openTasks: taskStats[0]?.count ?? 0,
      activeGoals: goalStats[0]?.count ?? 0,
      openConversations: convoStats[0]?.count ?? 0,
      overdueTasks: overdueStats[0]?.count ?? 0,
      dueTodayTasks: dueTodayStats[0]?.count ?? 0,
    },
    upcomingTasks,
    activeProjectsWithStats,
    goalsWithProgress: activeGoals.map((g) => ({ id: g.id, title: g.title, computedProgress: g.progressPercentage })),
    recentConvos,
    security: {
      items: openSecItems,
      stats: {
        openCritical: secOpenCritical[0]?.count ?? 0,
        openHigh: secOpenHigh[0]?.count ?? 0,
        totalOpen: secTotalOpen[0]?.count ?? 0,
      },
    },
    ai: {
      initiatives: recentAi,
      stats: {
        deployed: aiDeployed[0]?.count ?? 0,
        inDevelopment: aiInDev[0]?.count ?? 0,
        total: aiTotal[0]?.count ?? 0,
      },
    },
    vendor: {
      activeCount: vendorActive[0]?.count ?? 0,
      totalAnnualSpend: vendorSpend[0]?.total ? Number(vendorSpend[0].total) : 0,
      upcomingRenewals,
    },
    team: {
      activeCount: teamActive?.count ?? 0,
      byDepartment: teamByDept,
    },
    risk: await getRiskDashboardData(),
    taskTrend: await getTaskTrendData(),
  };
}

async function getTaskTrendData() {
  const weeks: { week: string; completed: number }[] = [];
  for (let i = 3; i >= 0; i--) {
    const [result] = await db
      .select({ count: count() })
      .from(tasks)
      .where(sql`${tasks.completedDate} >= date('now', '-' || ${i * 7 + 7} || ' days') AND ${tasks.completedDate} < date('now', '-' || ${i * 7} || ' days')`);
    weeks.push({
      week: `${i === 0 ? "This" : i === 1 ? "Last" : `${i}w ago`}`,
      completed: result?.count ?? 0,
    });
  }
  return weeks;
}

async function getRiskDashboardData() {
  const openRisks = await db.select().from(risks).where(sql`${risks.status} != 'closed'`)
    .orderBy(desc(sql`${risks.likelihood} * ${risks.impact}`)).limit(5);

  let critical = 0, high = 0, medium = 0, low = 0;
  for (const risk of openRisks) {
    const score = risk.likelihood * risk.impact;
    if (score >= 20) critical++;
    else if (score >= 12) high++;
    else if (score >= 6) medium++;
    else low++;
  }

  // Count total (not just top 5)
  const allOpen = await db.select().from(risks).where(sql`${risks.status} != 'closed'`);
  let tCrit = 0, tHigh = 0, tMed = 0, tLow = 0;
  for (const r of allOpen) {
    const s = r.likelihood * r.impact;
    if (s >= 20) tCrit++;
    else if (s >= 12) tHigh++;
    else if (s >= 6) tMed++;
    else tLow++;
  }

  return {
    risks: openRisks,
    stats: { critical: tCrit, high: tHigh, medium: tMed, low: tLow, total: allOpen.length },
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

        <div className="animate-fade-up stagger-2 flex flex-col lg:flex-row gap-4 items-start">
          <div className="flex-1 w-full">
            <StatsCards {...data.stats} />
          </div>
          {data.taskTrend.some(w => w.completed > 0) && (
            <div className="w-full lg:w-64 shrink-0">
              <TaskTrendChart data={data.taskTrend} />
            </div>
          )}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Left column: Tasks + Security + Conversations */}
          <div className="lg:col-span-3 space-y-6">
            <div className="animate-fade-up stagger-3">
              <RecentTasks tasks={data.upcomingTasks} />
            </div>
            <div className="animate-fade-up stagger-5">
              <SecuritySummary items={data.security.items} stats={data.security.stats} />
            </div>
            <div className="animate-fade-up stagger-6">
              <RiskSummary {...data.risk} />
            </div>
            <div className="animate-fade-up stagger-7">
              <RecentConversations conversations={data.recentConvos} />
            </div>
          </div>

          {/* Right column: Projects + AI + Vendors + Team + Goals */}
          <div className="lg:col-span-2 space-y-6">
            <div className="animate-fade-up stagger-4">
              <ActiveProjects projects={data.activeProjectsWithStats} />
            </div>
            <div className="animate-fade-up stagger-5">
              <AiSummary initiatives={data.ai.initiatives} stats={data.ai.stats} />
            </div>
            <div className="animate-fade-up stagger-6">
              <VendorSummary {...data.vendor} />
            </div>
            <div className="animate-fade-up stagger-7">
              <TeamSummary {...data.team} />
            </div>
            <div className="animate-fade-up stagger-8">
              <GoalsProgress goals={data.goalsWithProgress} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
