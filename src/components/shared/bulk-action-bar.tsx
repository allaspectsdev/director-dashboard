"use client";

import { bulkUpdateTasks, bulkDeleteTasks } from "@/actions/tasks";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TASK_STATUSES, PRIORITIES } from "@/lib/constants";
import { Trash2, X } from "lucide-react";
import { toast } from "sonner";
import type { TaskStatus, TaskPriority } from "@/types";

interface BulkActionBarProps {
  selectedIds: number[];
  onClear: () => void;
}

export function BulkActionBar({ selectedIds, onClear }: BulkActionBarProps) {
  if (selectedIds.length === 0) return null;

  async function handleStatusChange(status: string | null) {
    if (!status) return;
    await bulkUpdateTasks(selectedIds, { status: status as TaskStatus });
    onClear();
    toast.success(`Updated ${selectedIds.length} tasks`);
  }

  async function handlePriorityChange(priority: string | null) {
    if (!priority) return;
    await bulkUpdateTasks(selectedIds, { priority: priority as TaskPriority });
    onClear();
    toast.success(`Updated ${selectedIds.length} tasks`);
  }

  async function handleDelete() {
    await bulkDeleteTasks(selectedIds);
    onClear();
    toast.success(`Deleted ${selectedIds.length} tasks`);
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-up">
      <div className="flex items-center gap-3 rounded-xl border bg-card/95 backdrop-blur-sm px-4 py-2.5 shadow-xl">
        <span className="text-[13px] font-medium tabular-nums">
          {selectedIds.length} selected
        </span>

        <div className="h-5 w-px bg-border" />

        <Select onValueChange={handleStatusChange}>
          <SelectTrigger className="h-7 w-[110px] text-[11px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {TASK_STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize text-[12px]">
                {s.replace(/-/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={handlePriorityChange}>
          <SelectTrigger className="h-7 w-[100px] text-[11px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            {PRIORITIES.map((p) => (
              <SelectItem key={p} value={p} className="capitalize text-[12px]">
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-[11px] text-destructive hover:text-destructive"
          onClick={handleDelete}
        >
          <Trash2 className="mr-1 h-3 w-3" />
          Delete
        </Button>

        <div className="h-5 w-px bg-border" />

        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClear}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
