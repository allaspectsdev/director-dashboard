"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Target,
  ClipboardCheck,
  MessageSquare,
  StickyNote,
  Plus,
  Search,
} from "lucide-react";
import { globalSearch } from "@/actions/search";
import type { Task, Project, Conversation, Note } from "@/types";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, shortcut: "1" },
  { name: "Projects", href: "/projects", icon: FolderKanban, shortcut: "2" },
  { name: "Tasks", href: "/tasks", icon: CheckSquare, shortcut: "3" },
  { name: "Goals", href: "/goals", icon: Target, shortcut: "4" },
  { name: "Weekly Review", href: "/review", icon: ClipboardCheck, shortcut: "5" },
  { name: "Conversations", href: "/conversations", icon: MessageSquare, shortcut: "6" },
  { name: "Notes", href: "/notes", icon: StickyNote, shortcut: "7" },
];

interface SearchResults {
  tasks: Task[];
  projects: Project[];
  conversations: Conversation[];
  notes: Note[];
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }

      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (!isInput && !e.metaKey && !e.ctrlKey) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 7) {
          router.push(navItems[num - 1].href);
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  useEffect(() => {
    if (query.length < 2) {
      setResults(null);
      return;
    }

    const timer = setTimeout(() => {
      startTransition(async () => {
        const data = await globalSearch(query);
        setResults(data);
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      setResults(null);
      router.push(href);
    },
    [router]
  );

  const hasResults =
    results &&
    (results.tasks.length > 0 ||
      results.projects.length > 0 ||
      results.conversations.length > 0 ||
      results.notes.length > 0);

  return (
    <CommandDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setQuery(""); setResults(null); } }}>
      <CommandInput
        placeholder="Search or jump to..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {query.length >= 2 && !hasResults && !isPending && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}

        {hasResults && (
          <>
            {results.tasks.length > 0 && (
              <CommandGroup heading="Tasks">
                {results.tasks.map((task) => (
                  <CommandItem
                    key={`task-${task.id}`}
                    onSelect={() => navigate("/tasks")}
                  >
                    <CheckSquare className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                    <span className="truncate">{task.title}</span>
                    <span className="ml-auto text-[10px] text-muted-foreground capitalize">
                      {task.status.replace(/-/g, " ")}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {results.projects.length > 0 && (
              <CommandGroup heading="Projects">
                {results.projects.map((project) => (
                  <CommandItem
                    key={`project-${project.id}`}
                    onSelect={() => navigate(`/projects/${project.id}`)}
                  >
                    <FolderKanban className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                    <span className="truncate">{project.name}</span>
                    <span className="ml-auto text-[10px] text-muted-foreground capitalize">
                      {project.status.replace(/-/g, " ")}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {results.conversations.length > 0 && (
              <CommandGroup heading="Conversations">
                {results.conversations.map((convo) => (
                  <CommandItem
                    key={`convo-${convo.id}`}
                    onSelect={() => navigate(`/conversations/${convo.id}`)}
                  >
                    <MessageSquare className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                    <span className="truncate">{convo.topic}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {results.notes.length > 0 && (
              <CommandGroup heading="Notes">
                {results.notes.map((note) => (
                  <CommandItem
                    key={`note-${note.id}`}
                    onSelect={() => navigate("/notes")}
                  >
                    <StickyNote className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                    <span className="truncate">{note.title || "Untitled"}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            <CommandSeparator />
          </>
        )}

        {(!query || query.length < 2) && (
          <>
            <CommandGroup heading="Navigate">
              {navItems.map((item) => (
                <CommandItem
                  key={item.href}
                  onSelect={() => navigate(item.href)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                  <CommandShortcut>{item.shortcut}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Quick Actions">
              <CommandItem onSelect={() => navigate("/tasks")}>
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </CommandItem>
              <CommandItem onSelect={() => navigate("/projects")}>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </CommandItem>
              <CommandItem onSelect={() => navigate("/conversations")}>
                <Plus className="mr-2 h-4 w-4" />
                New Conversation Thread
              </CommandItem>
              <CommandItem onSelect={() => navigate("/notes")}>
                <Plus className="mr-2 h-4 w-4" />
                New Note
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
