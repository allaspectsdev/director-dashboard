"use client";

import { useState } from "react";
import { createSecurityItem, updateSecurityItem } from "@/actions/security";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SECURITY_CATEGORIES, SECURITY_SEVERITIES, SECURITY_STATUSES } from "@/lib/constants";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import type { SecurityItem } from "@/types";

interface SecurityFormProps {
  item?: SecurityItem;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SecurityForm({ item, open: controlledOpen, onOpenChange: controlledOnOpenChange }: SecurityFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      category: formData.get("category") as SecurityItem["category"],
      severity: formData.get("severity") as SecurityItem["severity"],
      status: formData.get("status") as SecurityItem["status"],
      framework: (formData.get("framework") as string) || undefined,
      dueDate: (formData.get("dueDate") as string) || undefined,
      assignee: (formData.get("assignee") as string) || undefined,
    };

    try {
      if (item) {
        await updateSecurityItem(item.id, data);
        toast.success("Security item updated");
      } else {
        await createSecurityItem(data);
        toast.success("Security item created");
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
          New Item
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Security Item" : "New Security Item"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sec-title">Title</Label>
            <Input id="sec-title" name="title" defaultValue={item?.title} required autoFocus placeholder="e.g., HIPAA Risk Assessment Q1" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sec-desc">Description</Label>
            <Textarea id="sec-desc" name="description" defaultValue={item?.description || ""} placeholder="Details..." rows={3} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select name="category" defaultValue={item?.category || "compliance"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SECURITY_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Severity</Label>
              <Select name="severity" defaultValue={item?.severity || "medium"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SECURITY_SEVERITIES.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select name="status" defaultValue={item?.status || "open"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SECURITY_STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">{s.replace(/-/g, " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="framework">Framework</Label>
              <Input id="framework" name="framework" defaultValue={item?.framework || ""} placeholder="HIPAA, SOC2, NIST..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Input id="assignee" name="assignee" defaultValue={item?.assignee || ""} placeholder="Who's responsible?" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sec-due">Due Date</Label>
            <Input id="sec-due" name="dueDate" type="date" defaultValue={item?.dueDate || ""} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : item ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
