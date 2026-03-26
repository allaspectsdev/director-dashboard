import { Header } from "@/components/layout/header";
import { ConversationForm } from "@/components/conversations/conversation-form";
import { ConversationCard } from "@/components/conversations/conversation-card";
import { getConversations } from "@/actions/conversations";
import { EmptyState } from "@/components/shared/empty-state";
import { MessageSquare } from "lucide-react";

export default async function ConversationsPage() {
  const conversations = await getConversations();

  return (
    <div>
      <Header
        title="CEO Conversations"
        description="Track discussion threads and action items with your CEO."
      >
        <ConversationForm />
      </Header>

      <div className="mt-6">
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
