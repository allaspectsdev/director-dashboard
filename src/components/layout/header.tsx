import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  serif?: boolean;
}

export function Header({ title, description, children, className, serif = false }: HeaderProps) {
  return (
    <div className={cn("flex items-start justify-between animate-fade-up", className)}>
      <div>
        <h1
          className={cn(
            "text-[28px] leading-tight tracking-tight text-foreground",
            serif ? "font-heading" : "font-semibold"
          )}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2 animate-fade-in stagger-2">
          {children}
        </div>
      )}
    </div>
  );
}
