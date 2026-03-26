"use client";

import { useState } from "react";
import { updateGoal, deleteGoal } from "@/actions/goals";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateShort } from "@/lib/dates";
import { MoreHorizontal, Pencil, Trash2, Target } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import type { Goal, Project, Milestone } from "@/types";
import { GoalForm } from "./goal-form";

interface GoalWithDetails extends Goal {
  projects: Project[];
  milestones: Milestone[];
  computedProgress: number;
}

interface GoalCardProps {
  goal: GoalWithDetails;
  allProjects: Project[];
}

export function GoalCard({ goal, allProjects }: GoalCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  async function handleDelete() {
    await deleteGoal(goal.id);
    toast.success("Goal deleted");
  }

  return (
    <>
      <div className="group rounded-xl border bg-card p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Target className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">{goal.title}</h3>
              <StatusBadge
                type="goal"
                value={goal.status}
                className="mt-0.5"
              />
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                />
              }
            >
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {goal.description && (
          <p className="mt-3 text-xs text-muted-foreground line-clamp-2">
            {goal.description}
          </p>
        )}

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {goal.trackingType === "milestone"
                ? `${goal.milestones.filter((m) => m.status === "completed").length}/${goal.milestones.length} milestones`
                : "Progress"}
            </span>
            <span className="font-medium text-foreground">
              {goal.computedProgress}%
            </span>
          </div>
          <Progress value={goal.computedProgress} className="h-2" />
        </div>

        {goal.projects.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {goal.projects.map((p) => (
              <Badge key={p.id} variant="secondary" className="text-[10px]">
                {p.name}
              </Badge>
            ))}
          </div>
        )}

        {goal.targetDate && (
          <div className="mt-3 text-xs text-muted-foreground">
            Target: {formatDateShort(goal.targetDate)}
          </div>
        )}
      </div>

      <GoalForm
        goal={goal}
        projects={allProjects}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
