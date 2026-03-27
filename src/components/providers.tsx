"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CommandPalette } from "@/components/shared/command-palette";
import { KeyboardShortcuts } from "@/components/shared/keyboard-shortcuts";
import { SidebarProvider } from "@/components/layout/sidebar-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SidebarProvider>
        <TooltipProvider>
          {children}
          <CommandPalette />
          <KeyboardShortcuts />
          <Toaster position="bottom-right" richColors />
        </TooltipProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
