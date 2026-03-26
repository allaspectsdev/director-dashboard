import { Header } from "@/components/layout/header";
import { getNotes, createNote } from "@/actions/notes";
import { NoteCard } from "@/components/notes/note-card";
import { EmptyState } from "@/components/shared/empty-state";
import { StickyNote } from "lucide-react";
import { NewNoteButton } from "./new-note-button";

export default async function NotesPage() {
  const notesList = await getNotes();

  return (
    <div>
      <Header
        title="Notes"
        description="Quick notes, meeting notes, and thoughts."
      >
        <NewNoteButton />
      </Header>

      <div className="mt-6">
        {notesList.length === 0 ? (
          <EmptyState
            icon={StickyNote}
            title="No notes yet"
            description="Create your first note to capture thoughts and ideas."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notesList.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
