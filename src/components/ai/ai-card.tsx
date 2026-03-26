"use client";

import { useState } from "react";
import { deleteAiInitiative } from "@/actions/ai-initiatives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash2, Brain, Rocket } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AI_STATUS_COLORS, AI_CATEGORY_COLORS } from "@/lib/constants";
import { formatDateShort } from "@/lib/dates";
import type { AiInitiative } from "@/types";
import { AiForm } from "./ai-form";

interface AiCardProps {
  initiative: AiInitiative;
}

export function AiCard({ initiative }: AiCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <div className="group rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
              {initiative.status === "deployed" ? (
                <Rocket className="h-4 w-4 text-emerald-500" />
              ) : (
                <Brain className="h-4 w-4 text-violet-500" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold">{initiative.name}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <Badge variant="secondary" className={cn("border-0 text-[10px] font-semibold capitalize px-2 py-0", AI_STATUS_COLORS[initiative.status])}>
                  {initiative.status}
                </Badge>
                <Badge variant="secondary" className={cn("border-0 text-[10px] font-semibold capitalize px-2 py-0", AI_CATEGORY_COLORS[initiative.category])}>
                  {initiative.category}
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
              <DropdownMenuItem variant="destructive" onClick={() => { deleteAiInitiative(initiative.id); toast.success("Deleted"); }}>
                <Trash2 className="mr-2 h-4 w-4" />Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {initiative.description && (
          <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{initiative.description}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
          {initiative.model && (
            <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">{initiative.model}</span>
          )}
          {initiative.department && <span>{initiative.department}</span>}
          {initiative.launchDate && <span>Launch: {formatDateShort(initiative.launchDate)}</span>}
          {initiative.roiEstimate && <span className="font-medium text-emerald-600 dark:text-emerald-400">ROI: {initiative.roiEstimate}</span>}
        </div>

        {initiative.impact && (
          <p className="mt-2 text-[11px] text-muted-foreground/70 line-clamp-1 italic">{initiative.impact}</p>
        )}
      </div>

      <AiForm initiative={initiative} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}
