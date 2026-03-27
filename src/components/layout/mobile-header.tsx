"use client";

import { useSidebar } from "./sidebar-context";
import { Menu, Command } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileHeader() {
  const { toggle, isMobile } = useSidebar();

  if (!isMobile) return null;

  return (
    <div className="flex items-center gap-3 border-b px-4 py-3 lg:hidden">
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggle}>
        <Menu className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-primary">
          <Command className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
        </div>
        <span className="font-heading text-[15px] tracking-tight">Avery Bio</span>
      </div>
    </div>
  );
}
