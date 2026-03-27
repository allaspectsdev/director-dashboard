"use client";

import { useState } from "react";
import { deleteRisk } from "@/actions/risks";
import { createTask } from "@/actions/tasks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash2, ShieldAlert, ListPlus } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { RISK_STATUS_COLORS, RISK_CATEGORY_COLORS, getRiskLevel } from "@/lib/constants";
import { formatDateShort } from "@/lib/dates";
import type { Risk } from "@/types";
import { RiskForm } from "./risk-form";

interface RiskCardProps {
  risk: Risk;
}

export function RiskCard({ risk }: RiskCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const riskLevel = getRiskLevel(risk.likelihood, risk.impact);

  return (
    <>
      <div className="group rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <ShieldAlert className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">{risk.title}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <Badge variant="secondary" className={cn("border-0 text-[10px] font-semibold capitalize px-2 py-0", riskLevel.color)}>
                  {riskLevel.label} ({risk.likelihood * risk.impact})
                </Badge>
                <Badge variant="secondary" className={cn("border-0 text-[10px] font-semibold capitalize px-2 py-0", RISK_STATUS_COLORS[risk.status])}>
                  {risk.status}
                </Badge>
                <Badge variant="secondary" className={cn("border-0 text-[10px] font-semibold capitalize px-2 py-0", RISK_CATEGORY_COLORS[risk.category])}>
                  {risk.category}
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
                const score = risk.likelihood * risk.impact;
                await createTask({
                  title: `[Risk] ${risk.title}`,
                  description: risk.mitigationPlan || `Mitigation task for ${risk.category} risk (score: ${score})`,
                  priority: score >= 20 ? "urgent" : score >= 12 ? "high" : "medium",
                });
                toast.success("Mitigation task created");
              }}>
                <ListPlus className="mr-2 h-4 w-4" />Create Task
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={() => { deleteRisk(risk.id); toast.success("Deleted"); }}>
                <Trash2 className="mr-2 h-4 w-4" />Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {risk.description && (
          <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{risk.description}</p>
        )}

        {risk.mitigationPlan && (
          <div className="mt-2 rounded-md bg-muted/50 px-2.5 py-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">Mitigation</p>
            <p className="text-xs text-muted-foreground line-clamp-2">{risk.mitigationPlan}</p>
          </div>
        )}

        <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span>L:{risk.likelihood} x I:{risk.impact}</span>
          {risk.owner && <span>Owner: {risk.owner}</span>}
          {risk.reviewDate && <span>Review: {formatDateShort(risk.reviewDate)}</span>}
        </div>
      </div>

      <RiskForm risk={risk} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}
