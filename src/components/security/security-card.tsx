"use client";

import { useState } from "react";
import { deleteSecurityItem, updateSecurityItem } from "@/actions/security";
import { createTask } from "@/actions/tasks";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { formatDateShort } from "@/lib/dates";
import { MoreHorizontal, Pencil, Trash2, Shield, AlertTriangle, ListPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SECURITY_SEVERITY_COLORS, SECURITY_CATEGORY_COLORS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import type { SecurityItem } from "@/types";
import { SecurityForm } from "./security-form";

interface SecurityCardProps {
  item: SecurityItem;
}

const severityIcons: Record<string, string> = {
  critical: "border-red-500/50 bg-red-500/5",
  high: "border-orange-500/50 bg-orange-500/5",
  medium: "border-amber-500/30",
  low: "border-blue-500/30",
  info: "",
};

export function SecurityCard({ item }: SecurityCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <div className={cn(
        "group rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
        severityIcons[item.severity]
      )}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              item.severity === "critical" ? "bg-red-500/10" : "bg-primary/10"
            )}>
              {item.severity === "critical" ? (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              ) : (
                <Shield className="h-4 w-4 text-primary" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold">{item.title}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <Badge variant="secondary" className={cn("border-0 text-[10px] font-semibold capitalize px-2 py-0", SECURITY_SEVERITY_COLORS[item.severity])}>
                  {item.severity}
                </Badge>
                <Badge variant="secondary" className={cn("border-0 text-[10px] font-semibold capitalize px-2 py-0", SECURITY_CATEGORY_COLORS[item.category])}>
                  {item.category}
                </Badge>
                <Badge variant="secondary" className="border-0 text-[10px] font-semibold capitalize px-2 py-0 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  {item.status.replace(/-/g, " ")}
                </Badge>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100" />}>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={async () => {
                await createTask({
                  title: `[Security] ${item.title}`,
                  description: `Remediation task for ${item.category}: ${item.description || item.title}`,
                  priority: item.severity === "critical" ? "urgent" : item.severity === "high" ? "high" : "medium",
                });
                toast.success("Remediation task created");
              }}>
                <ListPlus className="mr-2 h-4 w-4" />Create Task
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={() => { deleteSecurityItem(item.id); toast.success("Deleted"); }}>
                <Trash2 className="mr-2 h-4 w-4" />Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {item.description && (
          <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
        )}

        <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
          {item.framework && <span className="font-medium">{item.framework}</span>}
          {item.assignee && <span>Assigned: {item.assignee}</span>}
          {item.dueDate && <span>Due: {formatDateShort(item.dueDate)}</span>}
        </div>
      </div>

      <SecurityForm item={item} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}
