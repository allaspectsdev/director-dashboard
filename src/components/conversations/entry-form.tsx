"use client";

import { useState } from "react";
import { addEntry } from "@/actions/conversations";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ENTRY_TYPES } from "@/lib/constants";
import { toast } from "sonner";
import { Send } from "lucide-react";

interface EntryFormProps {
  conversationId: number;
}

export function EntryForm({ conversationId }: EntryFormProps) {
  const [content, setContent] = useState("");
  const [entryType, setEntryType] = useState<string>("note");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await addEntry({
        conversationId,
        content: content.trim(),
        entryType: entryType as "note" | "action-item" | "decision" | "follow-up",
      });
      setContent("");
      setEntryType("note");
      toast.success("Entry added");
    } catch {
      toast.error("Failed to add entry");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a note, decision, action item, or follow-up..."
        rows={3}
        className="resize-none"
      />
      <div className="flex items-center justify-between">
        <Select value={entryType} onValueChange={(v) => setEntryType(v ?? "note")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ENTRY_TYPES.map((t) => (
              <SelectItem key={t} value={t} className="capitalize">
                {t.replace(/-/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" size="sm" disabled={loading || !content.trim()}>
          <Send className="mr-1 h-3 w-3" />
          Add Entry
        </Button>
      </div>
    </form>
  );
}
