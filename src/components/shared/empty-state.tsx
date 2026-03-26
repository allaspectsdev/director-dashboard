import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 text-center animate-fade-up",
        className
      )}
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60 border border-border/50">
        <Icon className="h-7 w-7 text-muted-foreground/50" strokeWidth={1.5} />
      </div>
      <h3 className="text-[14px] font-semibold">{title}</h3>
      <p className="mt-1.5 max-w-[280px] text-[13px] leading-relaxed text-muted-foreground/60">
        {description}
      </p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
