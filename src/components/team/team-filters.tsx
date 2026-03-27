"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { TEAM_DEPARTMENTS, TEAM_MEMBER_STATUSES } from "@/lib/constants";
import { useFilterParams } from "@/hooks/use-filter-params";

const filterKeys = ["department", "status", "search"];

function formatDepartment(dept: string): string {
  if (dept === "it") return "IT";
  if (dept === "ai") return "AI";
  return dept.charAt(0).toUpperCase() + dept.slice(1);
}

export function TeamFilters() {
  const { setFilter, clearFilters, hasFilters, getParam } = useFilterParams(
    "/team",
    filterKeys
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
        <Input
          placeholder="Search team members..."
          className="pl-9 h-8 text-[13px]"
          defaultValue={getParam("search") || ""}
          onChange={(e) => {
            const value = e.target.value;
            const timeout = setTimeout(() => setFilter("search", value), 300);
            return () => clearTimeout(timeout);
          }}
        />
      </div>

      {/* Department */}
      <Select
        value={getParam("department") || "all"}
        onValueChange={(v) => setFilter("department", v ?? "all")}
      >
        <SelectTrigger className="w-[130px] h-8 text-[12px]">
          <SelectValue placeholder="Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
          {TEAM_DEPARTMENTS.map((d) => (
            <SelectItem key={d} value={d}>
              {formatDepartment(d)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status */}
      <Select
        value={getParam("status") || "all"}
        onValueChange={(v) => setFilter("status", v ?? "all")}
      >
        <SelectTrigger className="w-[130px] h-8 text-[12px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {TEAM_MEMBER_STATUSES.map((s) => (
            <SelectItem key={s} value={s} className="capitalize">
              {s.replace(/-/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
