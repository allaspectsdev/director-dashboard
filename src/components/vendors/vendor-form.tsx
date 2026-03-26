"use client";

import { useState } from "react";
import { createVendor, updateVendor } from "@/actions/vendors";
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
import { VENDOR_CATEGORIES, VENDOR_STATUSES } from "@/lib/constants";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import type { Vendor } from "@/types";

interface VendorFormProps {
  vendor?: Vendor;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function VendorForm({ vendor, open: controlledOpen, onOpenChange: controlledOnOpenChange }: VendorFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const annualCostStr = fd.get("annualCost") as string;
    const monthlyCostStr = fd.get("monthlyCost") as string;

    const data = {
      name: fd.get("name") as string,
      description: (fd.get("description") as string) || undefined,
      category: fd.get("category") as string,
      status: fd.get("status") as string,
      contactName: (fd.get("contactName") as string) || undefined,
      contactEmail: (fd.get("contactEmail") as string) || undefined,
      website: (fd.get("website") as string) || undefined,
      contractStart: (fd.get("contractStart") as string) || undefined,
      contractEnd: (fd.get("contractEnd") as string) || undefined,
      annualCost: annualCostStr ? Math.round(parseFloat(annualCostStr) * 100) : undefined,
      monthlyCost: monthlyCostStr ? Math.round(parseFloat(monthlyCostStr) * 100) : undefined,
      notes: (fd.get("notes") as string) || undefined,
    };

    try {
      if (vendor) {
        await updateVendor(vendor.id, data);
        toast.success("Vendor updated");
      } else {
        await createVendor(data);
        toast.success("Vendor added");
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
          Add Vendor
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{vendor ? "Edit Vendor" : "Add Vendor"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="v-name">Vendor Name</Label>
            <Input id="v-name" name="name" defaultValue={vendor?.name} required autoFocus />
          </div>
          <div className="space-y-2">
            <Label htmlFor="v-desc">Description</Label>
            <Input id="v-desc" name="description" defaultValue={vendor?.description || ""} placeholder="What do they provide?" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select name="category" defaultValue={vendor?.category || "saas"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {VENDOR_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">{c.replace(/-/g, " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select name="status" defaultValue={vendor?.status || "active"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {VENDOR_STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Contact Name</Label>
              <Input id="contact-name" name="contactName" defaultValue={vendor?.contactName || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input id="contact-email" name="contactEmail" type="email" defaultValue={vendor?.contactEmail || ""} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="annual-cost">Annual Cost ($)</Label>
              <Input id="annual-cost" name="annualCost" type="number" step="0.01" defaultValue={vendor?.annualCost ? (vendor.annualCost / 100).toFixed(2) : ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly-cost">Monthly Cost ($)</Label>
              <Input id="monthly-cost" name="monthlyCost" type="number" step="0.01" defaultValue={vendor?.monthlyCost ? (vendor.monthlyCost / 100).toFixed(2) : ""} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="contract-start">Contract Start</Label>
              <Input id="contract-start" name="contractStart" type="date" defaultValue={vendor?.contractStart || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contract-end">Contract End</Label>
              <Input id="contract-end" name="contractEnd" type="date" defaultValue={vendor?.contractEnd || ""} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : vendor ? "Update" : "Add"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
