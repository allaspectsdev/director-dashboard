"use client";

import { useState } from "react";
import { createAiInitiative, updateAiInitiative } from "@/actions/ai-initiatives";
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
import { AI_CATEGORIES, AI_STATUSES } from "@/lib/constants";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import type { AiInitiative, Vendor } from "@/types";

interface AiFormProps {
  initiative?: AiInitiative;
  vendors?: Vendor[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AiForm({ initiative, vendors, open: controlledOpen, onOpenChange: controlledOnOpenChange }: AiFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get("name") as string,
      description: (fd.get("description") as string) || undefined,
      category: fd.get("category") as string,
      status: fd.get("status") as string,
      model: (fd.get("model") as string) || undefined,
      department: (fd.get("department") as string) || undefined,
      impact: (fd.get("impact") as string) || undefined,
      roiEstimate: (fd.get("roiEstimate") as string) || undefined,
      vendorId: fd.get("vendorId") && fd.get("vendorId") !== "none" ? Number(fd.get("vendorId")) : undefined,
      startDate: (fd.get("startDate") as string) || undefined,
      launchDate: (fd.get("launchDate") as string) || undefined,
    };

    try {
      if (initiative) {
        await updateAiInitiative(initiative.id, data);
        toast.success("AI initiative updated");
      } else {
        await createAiInitiative(data);
        toast.success("AI initiative created");
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
          New Initiative
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initiative ? "Edit AI Initiative" : "New AI Initiative"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ai-name">Name</Label>
            <Input id="ai-name" name="name" defaultValue={initiative?.name} required autoFocus placeholder="e.g., Lab Data Analysis Assistant" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ai-desc">Description</Label>
            <Textarea id="ai-desc" name="description" defaultValue={initiative?.description || ""} placeholder="What does this initiative aim to achieve?" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select name="category" defaultValue={initiative?.category || "experiment"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {AI_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select name="status" defaultValue={initiative?.status || "ideation"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {AI_STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="model">Model / Platform</Label>
              <Input id="model" name="model" defaultValue={initiative?.model || ""} placeholder="Claude, GPT-4, Custom..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" name="department" defaultValue={initiative?.department || ""} placeholder="R&D, IT, Operations..." />
            </div>
          </div>
          {vendors && vendors.length > 0 && (
            <div className="space-y-2">
              <Label>Vendor</Label>
              <Select name="vendorId" defaultValue={(initiative as any)?.vendorId?.toString() || "none"}>
                <SelectTrigger><SelectValue placeholder="Select vendor..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {vendors.map((v) => (
                    <SelectItem key={v.id} value={v.id.toString()}>{v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="impact">Business Impact</Label>
            <Textarea id="impact" name="impact" defaultValue={initiative?.impact || ""} placeholder="Expected business impact..." rows={2} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="roi">ROI Estimate</Label>
              <Input id="roi" name="roiEstimate" defaultValue={initiative?.roiEstimate || ""} placeholder="e.g., 3x" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start">Start Date</Label>
              <Input id="start" name="startDate" type="date" defaultValue={initiative?.startDate || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="launch">Launch Date</Label>
              <Input id="launch" name="launchDate" type="date" defaultValue={initiative?.launchDate || ""} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : initiative ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
