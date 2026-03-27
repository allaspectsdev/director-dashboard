import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { ConversationForm } from "@/components/conversations/conversation-form";
import { ConversationCard } from "@/components/conversations/conversation-card";
import { ConversationFilters } from "@/components/conversations/conversation-filters";
import { getConversations } from "@/actions/conversations";
import { EmptyState } from "@/components/shared/empty-state";
import { MessageSquare } from "lucide-react";
import type { ConversationStatus } from "@/types";

interface Props {
  searchParams: Promise<{ status?: string; search?: string }>;
}

export default async function ConversationsPage({ searchParams }: Props) {
  const params = await searchParams;
  const conversations = await getConversations({
    status: params.status as ConversationStatus | undefined,
    search: params.search || undefined,
  });

  return (
    <div>
      <Header
        title="CEO Conversations"
        description="Track discussion threads and action items with your CEO."
      >
        <ConversationForm />
      </Header>

      <div className="mt-6 space-y-5">
        <Suspense>
          <ConversationFilters />
        </Suspense>
        {conversations.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No conversations yet"
            description="Start tracking your conversations with the CEO to keep action items organized."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {conversations.map((convo) => (
              <ConversationCard key={convo.id} conversation={convo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
