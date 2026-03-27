import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { getNotes } from "@/actions/notes";
import { NoteCard } from "@/components/notes/note-card";
import { NoteFilters } from "@/components/notes/note-filters";
import { EmptyState } from "@/components/shared/empty-state";
import { StickyNote } from "lucide-react";
import { NewNoteButton } from "./new-note-button";

interface Props {
  searchParams: Promise<{ search?: string; pinned?: string }>;
}

export default async function NotesPage({ searchParams }: Props) {
  const params = await searchParams;
  const notesList = await getNotes({
    search: params.search || undefined,
    pinned: params.pinned === "true" ? true : undefined,
  });

  return (
    <div>
      <Header
        title="Notes"
        description="Quick notes, meeting notes, and thoughts."
      >
        <NewNoteButton />
      </Header>

      <div className="mt-6 space-y-5">
        <Suspense>
          <NoteFilters />
        </Suspense>
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
