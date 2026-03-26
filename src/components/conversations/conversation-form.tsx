"use client";

import { useState } from "react";
import { createConversation, updateConversation } from "@/actions/conversations";
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
import { CONVERSATION_STATUSES } from "@/lib/constants";
import { toast } from "sonner";
import type { Conversation } from "@/types";
import { Plus } from "lucide-react";

interface ConversationFormProps {
  conversation?: Conversation;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ConversationForm({
  conversation,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ConversationFormProps) {
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
      topic: formData.get("topic") as string,
      summary: (formData.get("summary") as string) || undefined,
      status: formData.get("status") as Conversation["status"] | undefined,
    };

    try {
      if (conversation) {
        await updateConversation(conversation.id, data);
        toast.success("Conversation updated");
      } else {
        await createConversation(data);
        toast.success("Conversation created");
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
          New Thread
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {conversation ? "Edit Thread" : "New Conversation Thread"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              name="topic"
              defaultValue={conversation?.topic}
              placeholder="What was discussed?"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              name="summary"
              defaultValue={conversation?.summary || ""}
              placeholder="Brief summary..."
              rows={2}
            />
          </div>

          {conversation && (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select name="status" defaultValue={conversation.status}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONVERSATION_STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : conversation ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
