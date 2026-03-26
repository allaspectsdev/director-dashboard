"use client";

import { deleteEntry, convertEntryToTask } from "@/actions/conversations";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatRelative } from "@/lib/dates";
import { Button } from "@/components/ui/button";
import { CheckSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { ConversationEntry } from "@/types";

interface EntryListProps {
  entries: ConversationEntry[];
  conversationId: number;
}

export function EntryList({ entries, conversationId }: EntryListProps) {
  if (entries.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No entries yet. Add your first note below.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="group rounded-lg border bg-card p-3 transition-colors"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge type="entry" value={entry.entryType} />
                <span className="text-[11px] text-muted-foreground">
                  {formatRelative(entry.createdAt)}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{entry.content}</p>
            </div>
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              {entry.entryType === "action-item" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={async () => {
                    await convertEntryToTask(entry.id, conversationId);
                    toast.success("Converted to task");
                  }}
                  title="Convert to task"
                >
                  <CheckSquare className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={async () => {
                  await deleteEntry(entry.id);
                  toast.success("Entry deleted");
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
