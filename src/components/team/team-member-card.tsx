"use client";

import { useState } from "react";
import { deleteTeamMember } from "@/actions/team";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash2, User, Calendar } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { TeamMember } from "@/types";
import { TeamMemberForm } from "./team-member-form";
import Link from "next/link";

const DEPT_COLORS: Record<string, string> = {
  it: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  security: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  ai: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  engineering: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  other: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

interface TeamMemberCardProps {
  member: TeamMember;
  meetingCount?: number;
  lastMeeting?: string | null;
}

export function TeamMemberCard({ member, meetingCount = 0, lastMeeting }: TeamMemberCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <Link href={`/team/${member.id}`} className="block">
        <div className={cn(
          "group rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
          member.status !== "active" && "opacity-60"
        )}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {initials}
              </div>
              <div>
                <h3 className="text-sm font-semibold">{member.name}</h3>
                <p className="text-xs text-muted-foreground">{member.role}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <Badge variant="secondary" className={cn("border-0 text-[10px] font-semibold uppercase px-2 py-0", DEPT_COLORS[member.department])}>
                    {member.department === "ai" ? "AI" : member.department === "it" ? "IT" : member.department}
                  </Badge>
                  {member.status !== "active" && (
                    <Badge variant="secondary" className="border-0 text-[10px] font-semibold capitalize px-2 py-0 bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                      {member.status.replace(/-/g, " ")}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100" />}>
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.preventDefault(); setEditOpen(true); }}>
                  <Pencil className="mr-2 h-4 w-4" />Edit
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={(e) => { e.preventDefault(); deleteTeamMember(member.id); toast.success("Removed"); }}>
                  <Trash2 className="mr-2 h-4 w-4" />Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {meetingCount} 1:1s
            </span>
            {lastMeeting && <span>Last: {lastMeeting}</span>}
            {member.email && <span className="truncate">{member.email}</span>}
          </div>
        </div>
      </Link>

      <TeamMemberForm member={member} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}
