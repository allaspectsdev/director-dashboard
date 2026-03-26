import Link from "next/link";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatRelative } from "@/lib/dates";
import { MessageSquare, ArrowRight } from "lucide-react";
import type { Conversation } from "@/types";

interface RecentConversationsProps {
  conversations: Conversation[];
}

export function RecentConversations({
  conversations,
}: RecentConversationsProps) {
  return (
    <div className="widget-section">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15">
            <MessageSquare className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
          </div>
          <h2 className="text-[13px] font-semibold tracking-tight">CEO Threads</h2>
        </div>
        <Link
          href="/conversations"
          className="group flex items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          View all
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-[13px] text-muted-foreground/60">No open threads</p>
        </div>
      ) : (
        <div className="space-y-1">
          {conversations.map((convo) => (
            <Link
              key={convo.id}
              href={`/conversations/${convo.id}`}
              className="flex items-center gap-3 rounded-lg p-2.5 transition-all duration-200 hover:bg-accent/40"
            >
              <div className="flex-1 min-w-0">
                <span className="text-[13px] font-medium truncate block">
                  {convo.topic}
                </span>
                <span className="text-[11px] text-muted-foreground/60">
                  {formatRelative(convo.updatedAt)}
                </span>
              </div>
              <StatusBadge type="conversation" value={convo.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
