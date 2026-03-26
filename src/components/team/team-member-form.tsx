"use client";

import { useState } from "react";
import { createTeamMember, updateTeamMember } from "@/actions/team";
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
import { TEAM_DEPARTMENTS, TEAM_MEMBER_STATUSES } from "@/lib/constants";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import type { TeamMember } from "@/types";

interface TeamMemberFormProps {
  member?: TeamMember;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TeamMemberForm({ member, open: controlledOpen, onOpenChange: controlledOnOpenChange }: TeamMemberFormProps) {
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
      role: fd.get("role") as string,
      department: fd.get("department") as string,
      email: (fd.get("email") as string) || undefined,
      startDate: (fd.get("startDate") as string) || undefined,
      notes: (fd.get("notes") as string) || undefined,
    };

    try {
      if (member) {
        await updateTeamMember(member.id, data);
        toast.success("Team member updated");
      } else {
        await createTeamMember(data);
        toast.success("Team member added");
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
          Add Member
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{member ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tm-name">Name</Label>
            <Input id="tm-name" name="name" defaultValue={member?.name} required autoFocus />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tm-role">Role / Title</Label>
            <Input id="tm-role" name="role" defaultValue={member?.role} required placeholder="e.g., Security Engineer" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Department</Label>
              <Select name="department" defaultValue={member?.department || "it"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TEAM_DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d} className="capitalize">{d === "ai" ? "AI" : d === "it" ? "IT" : d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tm-email">Email</Label>
              <Input id="tm-email" name="email" type="email" defaultValue={member?.email || ""} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tm-start">Start Date</Label>
            <Input id="tm-start" name="startDate" type="date" defaultValue={member?.startDate || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tm-notes">Notes</Label>
            <Textarea id="tm-notes" name="notes" defaultValue={member?.notes || ""} placeholder="Skills, focus areas, performance notes..." rows={3} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : member ? "Update" : "Add"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
