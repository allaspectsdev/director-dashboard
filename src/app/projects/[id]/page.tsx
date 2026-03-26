import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { getProjectWithDetails, deleteProject } from "@/actions/projects";
import { MilestoneList } from "@/components/projects/milestone-list";
import { TaskList } from "@/components/tasks/task-list";
import { TaskForm } from "@/components/tasks/task-form";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityIndicator } from "@/components/shared/priority-indicator";
import { formatDate } from "@/lib/dates";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { ProjectActions } from "./project-actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const project = await getProjectWithDetails(Number(id));

  if (!project) notFound();

  const taskProgress =
    project.tasks.length > 0
      ? Math.round(
          (project.tasks.filter((t) => t.status === "done").length /
            project.tasks.length) *
            100
        )
      : 0;

  return (
    <div>
      <Link
        href="/projects"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Projects
      </Link>

      <Header title={project.name} description={project.description || undefined}>
        <ProjectActions project={project} />
      </Header>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <StatusBadge type="project" value={project.status} />
        <div className="flex items-center gap-1.5">
          <PriorityIndicator priority={project.priority} />
          <span className="text-xs text-muted-foreground capitalize">
            {project.priority}
          </span>
        </div>
        {project.startDate && (
          <span className="text-xs text-muted-foreground">
            Started {formatDate(project.startDate)}
          </span>
        )}
        {project.targetDate && (
          <span className="text-xs text-muted-foreground">
            Target {formatDate(project.targetDate)}
          </span>
        )}
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <span>Overall progress</span>
          <span>{taskProgress}%</span>
        </div>
        <Progress value={taskProgress} className="h-2" />
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <MilestoneList
            milestones={project.milestones}
            projectId={project.id}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Tasks</h3>
            <TaskForm
              projects={[project]}
            />
          </div>
          <TaskList tasks={project.tasks} projects={[project]} />
        </div>
      </div>
    </div>
  );
}
