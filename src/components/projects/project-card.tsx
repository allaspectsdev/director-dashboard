"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityIndicator } from "@/components/shared/priority-indicator";
import { formatDateShort } from "@/lib/dates";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight } from "lucide-react";

interface ProjectWithStats {
  id: number;
  name: string;
  description: string | null;
  status: string;
  priority: string;
  startDate: string | null;
  targetDate: string | null;
  color: string | null;
  milestoneCount: number;
  milestoneCompleted: number;
  taskCount: number;
  taskCompleted: number;
}

interface ProjectCardProps {
  project: ProjectWithStats;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const progress =
    project.taskCount > 0
      ? Math.round((project.taskCompleted / project.taskCount) * 100)
      : 0;

  const color = project.color || "#6366f1";

  return (
    <Link href={`/projects/${project.id}`}>
      <div className="group relative overflow-hidden rounded-xl border bg-card p-5 transition-all duration-300 card-hover">
        {/* Color accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}00)` }}
        />

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-[15px] font-bold"
              style={{
                backgroundColor: `${color}12`,
                color: color,
              }}
            >
              {project.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-[14px] font-semibold tracking-tight group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <PriorityIndicator priority={project.priority} />
                <StatusBadge type="project" value={project.status} />
              </div>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground/30 transition-all group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>

        {project.description && (
          <p className="mt-3 line-clamp-2 text-[12px] leading-relaxed text-muted-foreground/70">
            {project.description}
          </p>
        )}

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground/60">
              {project.taskCompleted}/{project.taskCount} tasks
            </span>
            <span className="font-semibold tabular-nums">{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground/50">
          <span>
            {project.milestoneCompleted}/{project.milestoneCount} milestones
          </span>
          {(project.startDate || project.targetDate) && (
            <span>
              {project.startDate && formatDateShort(project.startDate)}
              {project.startDate && project.targetDate && " → "}
              {project.targetDate && formatDateShort(project.targetDate)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
