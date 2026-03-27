"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Pin } from "lucide-react";
import { useFilterParams } from "@/hooks/use-filter-params";
import { cn } from "@/lib/utils";

const filterKeys = ["search", "pinned"];

export function NoteFilters() {
  const { setFilter, clearFilters, hasFilters, getParam } = useFilterParams(
    "/notes",
    filterKeys
  );

  const isPinned = getParam("pinned") === "true";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
        <Input
          placeholder="Search notes..."
          className="pl-9 h-8 text-[13px]"
          defaultValue={getParam("search") || ""}
          onChange={(e) => {
            const value = e.target.value;
            const timeout = setTimeout(() => setFilter("search", value), 300);
            return () => clearTimeout(timeout);
          }}
        />
      </div>

      {/* Pinned toggle */}
      <Button
        variant={isPinned ? "default" : "outline"}
        size="sm"
        className={cn("h-8 text-[12px]", isPinned && "gap-1")}
        onClick={() => setFilter("pinned", isPinned ? null : "true")}
      >
        <Pin className="mr-1 h-3 w-3" />
        Pinned only
      </Button>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-[12px]"
          onClick={clearFilters}
        >
          <X className="mr-1 h-3 w-3" />
          Clear
        </Button>
      )}
    </div>
  );
}
