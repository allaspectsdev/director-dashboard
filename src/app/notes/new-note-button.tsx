"use client";

import { createNote } from "@/actions/notes";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export function NewNoteButton() {
  async function handleClick() {
    await createNote({ content: "" });
    toast.success("Note created");
  }

  return (
    <Button size="sm" onClick={handleClick}>
      <Plus className="mr-1 h-4 w-4" />
      New Note
    </Button>
  );
}
