"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TASK_STATUSES, PRIORITIES } from "@/lib/constants";
import { Search, X, List, Columns3, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

interface TaskFiltersProps {
  projects?: Project[];
}

const views = [
  { key: "list", icon: List, label: "List" },
  { key: "board", icon: Columns3, label: "Board" },
  { key: "table", icon: Table2, label: "Table" },
] as const;

export function TaskFilters({ projects }: TaskFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "list";

  const setFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/tasks?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (currentView !== "list") params.set("view", currentView);
    router.push(`/tasks?${params.toString()}`);
  }, [router, currentView]);

  const hasFilters =
    searchParams.has("status") ||
    searchParams.has("priority") ||
    searchParams.has("projectId") ||
    searchParams.has("search");

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* View toggle */}
      <div className="flex items-center rounded-lg border bg-muted/30 p-0.5">
        {views.map((v) => (
          <button
            key={v.key}
            onClick={() => setFilter("view", v.key === "list" ? null : v.key)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-all duration-150",
              currentView === v.key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            title={v.label}
          >
            <v.icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{v.label}</span>
          </button>
        ))}
      </div>

      <div className="h-6 w-px bg-border" />

      {/* Search */}
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
        <Input
          placeholder="Search tasks..."
          className="pl-9 h-8 text-[13px]"
          defaultValue={searchParams.get("search") || ""}
          onChange={(e) => {
            const value = e.target.value;
            const timeout = setTimeout(() => setFilter("search", value), 300);
            return () => clearTimeout(timeout);
          }}
        />
      </div>

      {/* Filters */}
      <Select
        value={searchParams.get("status") || "all"}
        onValueChange={(v) => setFilter("status", v ?? "all")}
      >
        <SelectTrigger className="w-[130px] h-8 text-[12px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {TASK_STATUSES.map((s) => (
            <SelectItem key={s} value={s} className="capitalize">
              {s.replace(/-/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("priority") || "all"}
        onValueChange={(v) => setFilter("priority", v ?? "all")}
      >
        <SelectTrigger className="w-[120px] h-8 text-[12px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          {PRIORITIES.map((p) => (
            <SelectItem key={p} value={p} className="capitalize">
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {projects && projects.length > 0 && (
        <Select
          value={searchParams.get("projectId") || "all"}
          onValueChange={(v) => setFilter("projectId", v ?? "all")}
        >
          <SelectTrigger className="w-[150px] h-8 text-[12px]">
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id.toString()}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {hasFilters && (
        <Button variant="ghost" size="sm" className="h-8 text-[12px]" onClick={clearFilters}>
          <X className="mr-1 h-3 w-3" />
          Clear
        </Button>
      )}
    </div>
  );
}
