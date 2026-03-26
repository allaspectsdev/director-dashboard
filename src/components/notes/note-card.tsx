"use client";

import { useState } from "react";
import { updateNote, deleteNote, toggleNotePin } from "@/actions/notes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { formatRelative } from "@/lib/dates";
import { Pin, PinOff, Trash2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Note } from "@/types";

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title || "");
  const [content, setContent] = useState(note.content);

  async function handleSave() {
    await updateNote(note.id, {
      title: title || null,
      content,
    });
    setEditing(false);
    toast.success("Note saved");
  }

  async function handleDelete() {
    await deleteNote(note.id);
    toast.success("Note deleted");
  }

  async function handleTogglePin() {
    await toggleNotePin(note.id);
  }

  return (
    <div
      className={cn(
        "group rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-sm",
        note.isPinned && "border-primary/30 bg-primary/[0.02]"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        {editing ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="text-sm font-semibold h-7 px-1"
          />
        ) : (
          <h3
            className="text-sm font-semibold cursor-pointer"
            onClick={() => setEditing(true)}
          >
            {note.title || "Untitled note"}
          </h3>
        )}
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleTogglePin}
            title={note.isPinned ? "Unpin" : "Pin"}
          >
            {note.isPinned ? (
              <PinOff className="h-3.5 w-3.5" />
            ) : (
              <Pin className="h-3.5 w-3.5" />
            )}
          </Button>
          {editing && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleSave}
            >
              <Save className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {editing ? (
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[80px] resize-none text-sm"
          onBlur={handleSave}
        />
      ) : (
        <p
          className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap cursor-pointer"
          onClick={() => setEditing(true)}
        >
          {note.content}
        </p>
      )}

      <div className="mt-2 flex items-center gap-2">
        {note.isPinned && (
          <Pin className="h-3 w-3 text-primary" />
        )}
        <span className="text-[11px] text-muted-foreground">
          {formatRelative(note.updatedAt)}
        </span>
      </div>
    </div>
  );
}
