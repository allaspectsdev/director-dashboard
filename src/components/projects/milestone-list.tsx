"use client";

import { useState } from "react";
import { toggleMilestoneStatus, deleteMilestone } from "@/actions/milestones";
import { formatDateShort } from "@/lib/dates";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Check,
  Circle,
  Clock,
  Diamond,
  Plus,
  Trash2,
} from "lucide-react";
import { createMilestone } from "@/actions/milestones";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Milestone } from "@/types";

interface MilestoneListProps {
  milestones: Milestone[];
  projectId: number;
}

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Circle className="h-3.5 w-3.5 text-muted-foreground" />,
  "in-progress": <Clock className="h-3.5 w-3.5 text-blue-500" />,
  completed: <Check className="h-3.5 w-3.5 text-emerald-500" />,
};

export function MilestoneList({ milestones, projectId }: MilestoneListProps) {
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createMilestone({
        projectId,
        title: formData.get("title") as string,
        description: (formData.get("description") as string) || undefined,
        targetDate: (formData.get("targetDate") as string) || undefined,
      });
      toast.success("Milestone created");
      setFormOpen(false);
    } catch {
      toast.error("Failed to create milestone");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Diamond className="h-4 w-4 text-primary" />
          Milestones
        </h3>
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger render={<Button variant="outline" size="sm" />}>
            <Plus className="mr-1 h-3 w-3" />
            Add
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Milestone</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ms-title">Title</Label>
                <Input id="ms-title" name="title" required autoFocus placeholder="Milestone title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ms-date">Target Date</Label>
                <Input id="ms-date" name="targetDate" type="date" />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {milestones.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          No milestones yet.
        </p>
      ) : (
        <div className="space-y-2">
          {milestones.map((ms) => (
            <div
              key={ms.id}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors",
                ms.status === "completed" && "opacity-60"
              )}
            >
              <button
                onClick={() => toggleMilestoneStatus(ms.id)}
                className="flex-shrink-0 hover:scale-110 transition-transform"
              >
                {statusIcons[ms.status]}
              </button>
              <div className="flex-1 min-w-0">
                <span
                  className={cn(
                    "text-sm font-medium",
                    ms.status === "completed" && "line-through text-muted-foreground"
                  )}
                >
                  {ms.title}
                </span>
              </div>
              {ms.targetDate && (
                <span className="text-xs text-muted-foreground">
                  {formatDateShort(ms.targetDate)}
                </span>
              )}
              <StatusBadge type="task" value={ms.status} />
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                onClick={() => {
                  deleteMilestone(ms.id);
                  toast.success("Milestone deleted");
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
