"use client";

import { useState } from "react";
import { createTask } from "@/actions/tasks";
import { Input } from "@/components/ui/input";
import { Plus, Zap } from "lucide-react";
import { toast } from "sonner";

export function QuickAdd() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;

    setLoading(true);
    try {
      let title = value.trim();
      let priority: "low" | "medium" | "high" | "urgent" = "medium";

      if (title.startsWith("!!! ")) {
        priority = "urgent";
        title = title.slice(4);
      } else if (title.startsWith("!! ")) {
        priority = "high";
        title = title.slice(3);
      } else if (title.startsWith("! ")) {
        priority = "high";
        title = title.slice(2);
      }

      await createTask({ title, priority });
      setValue("");
      toast.success("Task added");
    } catch {
      toast.error("Failed to add task");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        className={`relative rounded-xl border transition-all duration-300 ${
          focused
            ? "border-primary/40 bg-card shadow-[0_0_0_3px_oklch(0.45_0.24_264_/_0.08)] dark:shadow-[0_0_0_3px_oklch(0.62_0.22_264_/_0.1)]"
            : "border-border bg-card/60 hover:border-border/80"
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <div className={`transition-colors ${focused ? "text-primary" : "text-muted-foreground/50"}`}>
            <Plus className="h-4 w-4" strokeWidth={2} />
          </div>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Quick add a task...  prefix with ! for high priority"
            className="flex-1 bg-transparent text-[13px] placeholder:text-muted-foreground/40 outline-none"
            disabled={loading}
          />
          {value.trim() && (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/50">
              <kbd className="rounded border bg-muted/50 px-1.5 py-0.5 font-mono text-[10px]">
                ↵
              </kbd>
              to add
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
