import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { FolderKanban, ArrowRight } from "lucide-react";
import type { Project } from "@/types";

interface ActiveProjectsProps {
  projects: { project: Project; taskCount: number; taskCompleted: number }[];
}

export function ActiveProjects({ projects }: ActiveProjectsProps) {
  return (
    <div className="widget-section">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 dark:bg-indigo-500/15">
            <FolderKanban className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
          </div>
          <h2 className="text-[13px] font-semibold tracking-tight">Active Projects</h2>
        </div>
        <Link
          href="/projects"
          className="group flex items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          View all
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-[13px] text-muted-foreground/60">No active projects</p>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map(({ project, taskCount, taskCompleted }) => {
            const progress =
              taskCount > 0
                ? Math.round((taskCompleted / taskCount) * 100)
                : 0;
            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group block rounded-lg border border-transparent p-3 transition-all duration-200 hover:bg-accent/40 hover:border-border"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: project.color || "#6366f1",
                        boxShadow: `0 0 6px ${project.color || "#6366f1"}40, 0 0 0 2px ${project.color || "#6366f1"}20`,
                      }}
                    />
                    <span className="text-[13px] font-medium">{project.name}</span>
                  </div>
                  <span className="text-[11px] tabular-nums font-medium text-muted-foreground">
                    {progress}%
                  </span>
                </div>
                <Progress value={progress} className="h-1" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
