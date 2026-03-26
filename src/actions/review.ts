"use server";

import { db } from "@/db";
import { tasks, milestones, projects } from "@/db/schema";
import { eq, sql, and, desc, asc } from "drizzle-orm";
import { startOfWeek, endOfWeek, addWeeks, format } from "date-fns";

export async function getWeeklyReview(weekOffset = 0) {
  const now = new Date();
  const targetWeek = addWeeks(now, weekOffset);
  const weekStart = format(startOfWeek(targetWeek, { weekStartsOn: 1 }), "yyyy-MM-dd");
  const weekEnd = format(endOfWeek(targetWeek, { weekStartsOn: 1 }), "yyyy-MM-dd");

  const nextWeekStart = format(addWeeks(startOfWeek(targetWeek, { weekStartsOn: 1 }), 1), "yyyy-MM-dd");
  const nextWeekEnd = format(addWeeks(endOfWeek(targetWeek, { weekStartsOn: 1 }), 1), "yyyy-MM-dd");

  const tasksCompleted = await db
    .select()
    .from(tasks)
    .where(
      sql`${tasks.completedDate} >= ${weekStart} AND ${tasks.completedDate} <= ${weekEnd}`
    )
    .orderBy(desc(tasks.completedDate));

  const tasksCreated = await db
    .select()
    .from(tasks)
    .where(
      sql`date(${tasks.createdAt}) >= ${weekStart} AND date(${tasks.createdAt}) <= ${weekEnd}`
    )
    .orderBy(desc(tasks.createdAt));

  const tasksOverdue = await db
    .select()
    .from(tasks)
    .where(
      sql`${tasks.dueDate} < ${weekEnd} AND ${tasks.status} != 'done' AND ${tasks.dueDate} IS NOT NULL`
    )
    .orderBy(asc(tasks.dueDate));

  const milestonesCompleted = await db
    .select()
    .from(milestones)
    .where(
      sql`${milestones.completedDate} >= ${weekStart} AND ${milestones.completedDate} <= ${weekEnd}`
    );

  const upcomingTasks = await db
    .select()
    .from(tasks)
    .where(
      sql`${tasks.dueDate} >= ${nextWeekStart} AND ${tasks.dueDate} <= ${nextWeekEnd} AND ${tasks.status} != 'done'`
    )
    .orderBy(asc(tasks.dueDate));

  const upcomingMilestones = await db
    .select()
    .from(milestones)
    .where(
      sql`${milestones.targetDate} >= ${nextWeekStart} AND ${milestones.targetDate} <= ${nextWeekEnd} AND ${milestones.status} != 'completed'`
    )
    .orderBy(asc(milestones.targetDate));

  // Group completed tasks by project
  const allProjects = await db.select().from(projects);
  const projectMap = new Map(allProjects.map((p) => [p.id, p]));

  const completedByProject = new Map<number | null, typeof tasksCompleted>();
  for (const task of tasksCompleted) {
    const key = task.projectId;
    const existing = completedByProject.get(key) || [];
    existing.push(task);
    completedByProject.set(key, existing);
  }

  return {
    weekStart,
    weekEnd,
    tasksCompleted,
    tasksCreated,
    tasksOverdue,
    milestonesCompleted,
    upcomingTasks,
    upcomingMilestones,
    completedByProject: Array.from(completedByProject.entries()).map(
      ([projectId, projectTasks]) => ({
        project: projectId ? projectMap.get(projectId) || null : null,
        tasks: projectTasks,
      })
    ),
  };
}
