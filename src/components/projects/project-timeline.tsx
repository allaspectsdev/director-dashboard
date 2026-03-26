"use client";

import { useMemo } from "react";
import {
  format,
  parseISO,
  differenceInDays,
  startOfMonth,
  endOfMonth,
  addMonths,
  isWithinInterval,
} from "date-fns";
import { EmptyState } from "@/components/shared/empty-state";
import { FolderKanban } from "lucide-react";

interface TimelineProject {
  id: number;
  name: string;
  startDate: string | null;
  targetDate: string | null;
  color: string | null;
  status: string;
}

interface ProjectTimelineProps {
  projects: TimelineProject[];
}

export function ProjectTimeline({ projects }: ProjectTimelineProps) {
  const timelineProjects = projects.filter(
    (p) => p.startDate || p.targetDate
  );

  const { months, timelineStart, totalDays } = useMemo(() => {
    if (timelineProjects.length === 0) {
      return { months: [], timelineStart: new Date(), totalDays: 1 };
    }

    const dates = timelineProjects.flatMap((p) => [
      p.startDate ? parseISO(p.startDate) : null,
      p.targetDate ? parseISO(p.targetDate) : null,
    ]).filter(Boolean) as Date[];

    const minDate = startOfMonth(
      new Date(Math.min(...dates.map((d) => d.getTime())))
    );
    const maxDate = endOfMonth(
      new Date(Math.max(...dates.map((d) => d.getTime())))
    );

    const monthsList: Date[] = [];
    let current = minDate;
    while (current <= maxDate) {
      monthsList.push(current);
      current = addMonths(current, 1);
    }

    return {
      months: monthsList,
      timelineStart: minDate,
      totalDays: Math.max(differenceInDays(maxDate, minDate), 1),
    };
  }, [timelineProjects]);

  if (timelineProjects.length === 0) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="No timeline data"
        description="Add start and target dates to your projects to see them on the timeline."
      />
    );
  }

  const today = new Date();
  const todayOffset =
    isWithinInterval(today, {
      start: timelineStart,
      end: addMonths(timelineStart, months.length),
    })
      ? (differenceInDays(today, timelineStart) / totalDays) * 100
      : null;

  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <div className="min-w-[600px]">
        {/* Month headers */}
        <div className="flex border-b bg-muted/30">
          <div className="w-48 flex-shrink-0 border-r px-4 py-2 text-xs font-medium text-muted-foreground">
            Project
          </div>
          <div className="relative flex flex-1">
            {months.map((month, i) => (
              <div
                key={i}
                className="flex-1 border-r px-2 py-2 text-center text-xs font-medium text-muted-foreground last:border-r-0"
              >
                {format(month, "MMM yyyy")}
              </div>
            ))}
          </div>
        </div>

        {/* Project rows */}
        {timelineProjects.map((project) => {
          const start = project.startDate
            ? parseISO(project.startDate)
            : project.targetDate
              ? parseISO(project.targetDate)
              : timelineStart;
          const end = project.targetDate
            ? parseISO(project.targetDate)
            : start;

          const leftPct =
            (differenceInDays(start, timelineStart) / totalDays) * 100;
          const widthPct = Math.max(
            (differenceInDays(end, start) / totalDays) * 100,
            1
          );

          return (
            <div key={project.id} className="flex border-b last:border-b-0">
              <div className="w-48 flex-shrink-0 border-r px-4 py-3">
                <span className="text-sm font-medium truncate block">
                  {project.name}
                </span>
              </div>
              <div className="relative flex-1 py-3 px-2">
                <div
                  className="absolute h-6 rounded-full top-1/2 -translate-y-1/2 transition-all"
                  style={{
                    left: `${Math.max(leftPct, 0)}%`,
                    width: `${Math.min(widthPct, 100 - leftPct)}%`,
                    backgroundColor: project.color || "#6366f1",
                    opacity: project.status === "completed" ? 0.5 : 0.85,
                  }}
                />
              </div>
            </div>
          );
        })}

        {/* Today line */}
        {todayOffset !== null && (
          <div
            className="absolute top-0 bottom-0 w-px border-l-2 border-dashed border-red-400 pointer-events-none z-10"
            style={{ left: `calc(12rem + ${todayOffset}% * (100% - 12rem) / 100)` }}
          />
        )}
      </div>
    </div>
  );
}
