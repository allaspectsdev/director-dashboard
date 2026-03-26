"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteProject } from "@/actions/projects";
import { ProjectForm } from "@/components/projects/project-form";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Project } from "@/types";

interface ProjectActionsProps {
  project: Project;
}

export function ProjectActions({ project }: ProjectActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    await deleteProject(project.id);
    toast.success("Project deleted");
    router.push("/projects");
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
        <Pencil className="mr-1 h-3 w-3" />
        Edit
      </Button>

      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="outline" size="sm" />}>
          <Trash2 className="mr-1 h-3 w-3" />
          Delete
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{project.name}&quot; and all its
              milestones. Tasks will be unlinked but not deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ProjectForm
        project={project}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}
