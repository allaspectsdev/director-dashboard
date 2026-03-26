import Link from "next/link";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { formatRelative } from "@/lib/dates";
import { MessageSquare, AlertCircle, ArrowUpRight } from "lucide-react";
import type { Conversation, Project } from "@/types";

interface ConversationWithDetails extends Conversation {
  entryCount: number;
  actionItemCount: number;
  projects: Project[];
}

interface ConversationCardProps {
  conversation: ConversationWithDetails;
}

export function ConversationCard({ conversation }: ConversationCardProps) {
  return (
    <Link href={`/conversations/${conversation.id}`}>
      <div className="group rounded-xl border bg-card p-5 transition-all duration-300 card-hover">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15">
              <MessageSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={1.8} />
            </div>
            <div>
              <h3 className="text-[14px] font-semibold tracking-tight group-hover:text-primary transition-colors">
                {conversation.topic}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <StatusBadge
                  type="conversation"
                  value={conversation.status}
                />
                {conversation.actionItemCount > 0 && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-orange-600 dark:text-orange-400">
                    <AlertCircle className="h-3 w-3" />
                    {conversation.actionItemCount} action items
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <ArrowUpRight className="h-4 w-4 text-muted-foreground/30 transition-all group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            <span className="text-[11px] text-muted-foreground/50">
              {formatRelative(conversation.updatedAt)}
            </span>
          </div>
        </div>

        {conversation.summary && (
          <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground/70 line-clamp-2">
            {conversation.summary}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {conversation.projects.map((p) => (
              <Badge key={p.id} variant="secondary" className="text-[10px] font-medium">
                {p.name}
              </Badge>
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground/40">
            {conversation.entryCount} entries
          </span>
        </div>
      </div>
    </Link>
  );
}
