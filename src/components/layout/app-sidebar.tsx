"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Target,
  ClipboardCheck,
  MessageSquare,
  StickyNote,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/review", label: "Weekly Review", icon: ClipboardCheck },
  { href: "/conversations", label: "Conversations", icon: MessageSquare },
  { href: "/notes", label: "Notes", icon: StickyNote },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[232px] flex-col border-r border-sidebar-border bg-sidebar">
      {/* Brand */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-sm">
            <Command className="h-[18px] w-[18px] text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-heading text-[17px] leading-tight tracking-tight text-sidebar-foreground">
              Command
            </h1>
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-sidebar-foreground/40">
              Director of Tech
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-2">
        <div className="space-y-0.5">
          {navItems.map((item, i) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-[9px] text-[13px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground/55 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground/90"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-sidebar-primary" />
                )}
                <item.icon
                  className={cn(
                    "h-[16px] w-[16px] transition-colors",
                    isActive ? "text-sidebar-primary" : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/60"
                  )}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 pb-4 space-y-3">
        <button className="flex w-full items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/30 px-3 py-2 text-[12px] text-sidebar-foreground/40 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground/60">
          <Command className="h-3 w-3" />
          <span>Search...</span>
          <kbd className="ml-auto inline-flex h-[18px] items-center rounded border border-sidebar-border bg-sidebar px-1 font-mono text-[10px]">
            ⌘K
          </kbd>
        </button>
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-medium text-sidebar-foreground/35">
            v1.0
          </span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
