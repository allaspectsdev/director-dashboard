import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { ProjectForm } from "@/components/projects/project-form";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectTimeline } from "@/components/projects/project-timeline";
import { ProjectFilters } from "@/components/projects/project-filters";
import { getProjectsWithStats } from "@/actions/projects";
import { EmptyState } from "@/components/shared/empty-state";
import { FolderKanban } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProjectStatus } from "@/types";

interface Props {
  searchParams: Promise<{ status?: string; priority?: string; search?: string }>;
}

export default async function ProjectsPage({ searchParams }: Props) {
  const params = await searchParams;
  const projects = await getProjectsWithStats({
    status: params.status as ProjectStatus | undefined,
    priority: params.priority || undefined,
    search: params.search || undefined,
  });

  return (
    <div>
      <Header title="Projects" description="Manage your projects and roadmap.">
        <ProjectForm />
      </Header>

      <div className="mt-6 space-y-5">
        <Suspense>
          <ProjectFilters />
        </Suspense>
        {projects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No projects yet"
            description="Create your first project to start organizing your work."
          />
        ) : (
          <Tabs defaultValue="grid">
            <TabsList>
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
            <TabsContent value="grid" className="mt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="timeline" className="mt-4">
              <ProjectTimeline projects={projects} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
