"use client";

import { useState } from "react";
import { createRisk, updateRisk } from "@/actions/risks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { RISK_CATEGORIES, RISK_STATUSES, getRiskLevel } from "@/lib/constants";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import type { Risk } from "@/types";

interface RiskFormProps {
  risk?: Risk;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function RiskForm({ risk, open: controlledOpen, onOpenChange: controlledOnOpenChange }: RiskFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [likelihood, setLikelihood] = useState(risk?.likelihood ?? 3);
  const [impact, setImpact] = useState(risk?.impact ?? 3);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const riskLevel = getRiskLevel(likelihood, impact);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      title: fd.get("title") as string,
      description: (fd.get("description") as string) || undefined,
      category: fd.get("category") as string,
      likelihood,
      impact,
      status: fd.get("status") as string,
      mitigationPlan: (fd.get("mitigationPlan") as string) || undefined,
      owner: (fd.get("owner") as string) || undefined,
      reviewDate: (fd.get("reviewDate") as string) || undefined,
    };

    try {
      if (risk) {
        await updateRisk(risk.id, data);
        toast.success("Risk updated");
      } else {
        await createRisk(data);
        toast.success("Risk created");
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
          Add Risk
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{risk ? "Edit Risk" : "Add Risk"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="risk-title">Risk Title</Label>
            <Input id="risk-title" name="title" defaultValue={risk?.title} required autoFocus placeholder="e.g., Single point of failure in lab data pipeline" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="risk-desc">Description</Label>
            <Textarea id="risk-desc" name="description" defaultValue={risk?.description || ""} placeholder="Describe the risk and potential consequences..." rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select name="category" defaultValue={risk?.category || "operational"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {RISK_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select name="status" defaultValue={risk?.status || "identified"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {RISK_STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Risk scoring */}
          <div className="rounded-lg border p-3 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-[12px]">Risk Score</Label>
              <span className={`text-[12px] font-semibold rounded-md px-2 py-0.5 ${riskLevel.color}`}>
                {riskLevel.label} ({likelihood * impact})
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-[11px] text-muted-foreground">Likelihood (1-5)</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setLikelihood(n)}
                      className={`flex h-8 w-8 items-center justify-center rounded-md text-[12px] font-medium transition-colors ${
                        likelihood === n
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] text-muted-foreground">Impact (1-5)</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setImpact(n)}
                      className={`flex h-8 w-8 items-center justify-center rounded-md text-[12px] font-medium transition-colors ${
                        impact === n
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mitigation">Mitigation Plan</Label>
            <Textarea id="mitigation" name="mitigationPlan" defaultValue={risk?.mitigationPlan || ""} placeholder="Steps to reduce or eliminate this risk..." rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="risk-owner">Owner</Label>
              <Input id="risk-owner" name="owner" defaultValue={risk?.owner || ""} placeholder="Who owns this risk?" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-date">Next Review</Label>
              <Input id="review-date" name="reviewDate" type="date" defaultValue={risk?.reviewDate || ""} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : risk ? "Update" : "Add"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
