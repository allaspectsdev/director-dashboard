"use client";

import { createNote } from "@/actions/notes";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function NewNoteButton() {
  const router = useRouter();

  async function handleClick() {
    await createNote({ content: "New note..." });
    router.refresh();
  }

  return (
    <Button size="sm" onClick={handleClick}>
      <Plus className="mr-1 h-4 w-4" />
      New Note
    </Button>
  );
}
