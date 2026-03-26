import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { getConversationWithEntries } from "@/actions/conversations";
import { EntryList } from "@/components/conversations/entry-list";
import { EntryForm } from "@/components/conversations/entry-form";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { ConversationActions } from "./conversation-actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ConversationDetailPage({ params }: Props) {
  const { id } = await params;
  const conversation = await getConversationWithEntries(Number(id));

  if (!conversation) notFound();

  return (
    <div>
      <Link
        href="/conversations"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Conversations
      </Link>

      <Header title={conversation.topic}>
        <ConversationActions conversation={conversation} />
      </Header>

      <div className="mt-3 flex items-center gap-3">
        <StatusBadge type="conversation" value={conversation.status} />
        {conversation.projects.map((p) => (
          <Badge key={p.id} variant="secondary" className="text-xs">
            {p.name}
          </Badge>
        ))}
      </div>

      {conversation.summary && (
        <p className="mt-3 text-sm text-muted-foreground">
          {conversation.summary}
        </p>
      )}

      {conversation.actionTasks.length > 0 && (
        <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-900 dark:bg-orange-950/30">
          <h3 className="text-xs font-semibold text-orange-700 dark:text-orange-300 mb-2">
            Linked Tasks ({conversation.actionTasks.length})
          </h3>
          <div className="space-y-1">
            {conversation.actionTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-2 text-xs">
                <StatusBadge type="task" value={task.status} />
                <span>{task.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator className="my-6" />

      <div className="space-y-6">
        <EntryList
          entries={conversation.entries}
          conversationId={conversation.id}
        />
        <EntryForm conversationId={conversation.id} />
      </div>
    </div>
  );
}
