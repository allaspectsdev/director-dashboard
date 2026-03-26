"use client";

import { useEffect, useState, useCallback } from "react";
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
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, shortcut: "1" },
  { name: "Projects", href: "/projects", icon: FolderKanban, shortcut: "2" },
  { name: "Tasks", href: "/tasks", icon: CheckSquare, shortcut: "3" },
  { name: "Goals", href: "/goals", icon: Target, shortcut: "4" },
  { name: "Weekly Review", href: "/review", icon: ClipboardCheck, shortcut: "5" },
  { name: "Conversations", href: "/conversations", icon: MessageSquare, shortcut: "6" },
  { name: "Notes", href: "/notes", icon: StickyNote, shortcut: "7" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }

      // Number shortcuts for navigation (when not in input)
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

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search or jump to..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
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
            <CommandShortcut>N</CommandShortcut>
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
      </CommandList>
    </CommandDialog>
  );
}
