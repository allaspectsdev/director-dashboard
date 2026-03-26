"use client";

import { useState } from "react";
import { createOneOnOne } from "@/actions/team";
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
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface OneOnOneFormProps {
  teamMemberId: number;
}

export function OneOnOneForm({ teamMemberId }: OneOnOneFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);

    try {
      await createOneOnOne({
        teamMemberId,
        meetingDate: fd.get("meetingDate") as string,
        mood: (fd.get("mood") as string) || undefined,
        notes: (fd.get("notes") as string) || undefined,
        actionItems: (fd.get("actionItems") as string) || undefined,
        followUps: (fd.get("followUps") as string) || undefined,
      });
      toast.success("1:1 recorded");
      setOpen(false);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus className="mr-1 h-4 w-4" />
        Record 1:1
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Record 1:1 Meeting</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="meeting-date">Meeting Date</Label>
              <Input
                id="meeting-date"
                name="meetingDate"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Mood</Label>
              <Select name="mood" defaultValue="good">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="great">Great</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="okay">Okay</SelectItem>
                  <SelectItem value="struggling">Struggling</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="oo-notes">Discussion Notes</Label>
            <Textarea id="oo-notes" name="notes" placeholder="Key topics discussed..." rows={4} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="action-items">Action Items</Label>
            <Textarea id="action-items" name="actionItems" placeholder="One per line..." rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="follow-ups">Follow-ups for Next Meeting</Label>
            <Textarea id="follow-ups" name="followUps" placeholder="Topics to revisit..." rows={2} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
