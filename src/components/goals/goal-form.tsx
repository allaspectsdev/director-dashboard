"use client";

import { useState } from "react";
import { createGoal, updateGoal, linkProjectToGoal, unlinkProjectFromGoal } from "@/actions/goals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GOAL_STATUSES } from "@/lib/constants";
import { toast } from "sonner";
import type { Goal, Project } from "@/types";
import { Plus } from "lucide-react";

interface GoalFormProps {
  goal?: Goal;
  projects?: Project[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function GoalForm({
  goal,
  projects,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: GoalFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      trackingType: formData.get("trackingType") as "percentage" | "milestone",
      status: formData.get("status") as Goal["status"],
      targetDate: (formData.get("targetDate") as string) || undefined,
      progressPercentage: goal?.trackingType === "percentage"
        ? Number(formData.get("progress") || 0)
        : undefined,
    };

    try {
      if (goal) {
        await updateGoal(goal.id, data);
        toast.success("Goal updated");
      } else {
        await createGoal(data);
        toast.success("Goal created");
      }
      setOpen(false);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger render={<Button size="sm" />}>
          <Plus className="mr-1 h-4 w-4" />
          New Goal
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{goal ? "Edit Goal" : "New Goal"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal-title">Title</Label>
            <Input
              id="goal-title"
              name="title"
              defaultValue={goal?.title}
              placeholder="What do you want to achieve?"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-desc">Description</Label>
            <Textarea
              id="goal-desc"
              name="description"
              defaultValue={goal?.description || ""}
              placeholder="Describe this goal..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tracking Type</Label>
              <Select
                name="trackingType"
                defaultValue={goal?.trackingType || "percentage"}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="milestone">Milestone-based</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {goal && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select name="status" defaultValue={goal.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GOAL_STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goal-target">Target Date</Label>
              <Input
                id="goal-target"
                name="targetDate"
                type="date"
                defaultValue={goal?.targetDate || ""}
              />
            </div>
            {goal?.trackingType === "percentage" && (
              <div className="space-y-2">
                <Label htmlFor="goal-progress">Progress (%)</Label>
                <Input
                  id="goal-progress"
                  name="progress"
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={goal.progressPercentage}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : goal ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
