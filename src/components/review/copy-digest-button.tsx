"use client";

import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CopyDigestButtonProps {
  digest: string;
}

export function CopyDigestButton({ digest }: CopyDigestButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(digest);
    setCopied(true);
    toast.success("CEO digest copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button size="sm" variant="outline" onClick={handleCopy}>
      {copied ? (
        <Check className="mr-1 h-3.5 w-3.5" />
      ) : (
        <Copy className="mr-1 h-3.5 w-3.5" />
      )}
      {copied ? "Copied!" : "Copy CEO Digest"}
    </Button>
  );
}
