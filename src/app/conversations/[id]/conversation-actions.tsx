"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteConversation } from "@/actions/conversations";
import { ConversationForm } from "@/components/conversations/conversation-form";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Conversation } from "@/types";

interface ConversationActionsProps {
  conversation: Conversation;
}

export function ConversationActions({
  conversation,
}: ConversationActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    await deleteConversation(conversation.id);
    toast.success("Conversation deleted");
    router.push("/conversations");
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
        <Pencil className="mr-1 h-3 w-3" />
        Edit
      </Button>

      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="outline" size="sm" />}>
          <Trash2 className="mr-1 h-3 w-3" />
          Delete
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this conversation and all its entries.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ConversationForm
        conversation={conversation}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}
