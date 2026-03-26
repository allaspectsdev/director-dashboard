import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { OneOnOneForm } from "@/components/team/one-on-one-form";
import { EmptyState } from "@/components/shared/empty-state";
import { getTeamMember, getOneOnOnes } from "@/actions/team";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { formatDate } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { MOOD_COLORS } from "@/lib/constants";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TeamMemberPage({ params }: Props) {
  const { id } = await params;
  const member = await getTeamMember(Number(id));
  if (!member) return notFound();

  const meetings = await getOneOnOnes(member.id);

  return (
    <div>
      <div className="mb-4">
        <Link href="/team" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Team
        </Link>
      </div>

      <Header
        title={member.name}
        description={`${member.role} — ${member.department === "ai" ? "AI" : member.department === "it" ? "IT" : member.department}`}
      >
        <OneOnOneForm teamMemberId={member.id} />
      </Header>

      {member.notes && (
        <div className="mt-4 rounded-lg border bg-card/50 p-4">
          <p className="text-sm text-muted-foreground">{member.notes}</p>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          1:1 Meeting History
        </h2>

        {meetings.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No 1:1 meetings yet"
            description="Record your first 1:1 meeting to start tracking discussions and action items."
          />
        ) : (
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="rounded-xl border bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{formatDate(meeting.meetingDate)}</span>
                    {meeting.mood && (
                      <Badge variant="secondary" className={cn("border-0 text-[10px] font-semibold capitalize px-2 py-0", MOOD_COLORS[meeting.mood])}>
                        {meeting.mood}
                      </Badge>
                    )}
                  </div>
                </div>

                {meeting.notes && (
                  <div className="prose prose-sm dark:prose-invert prose-p:my-1 max-w-none text-sm text-muted-foreground">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{meeting.notes}</ReactMarkdown>
                  </div>
                )}

                {meeting.actionItems && (
                  <div className="mt-3 rounded-lg border border-orange-200/50 dark:border-orange-500/20 bg-orange-50/50 dark:bg-orange-950/10 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">Action Items</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{meeting.actionItems}</p>
                  </div>
                )}

                {meeting.followUps && (
                  <div className="mt-2 rounded-lg border border-blue-200/50 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/10 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">Follow-ups</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{meeting.followUps}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
