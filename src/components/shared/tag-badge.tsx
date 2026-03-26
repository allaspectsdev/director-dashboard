import type { Tag } from "@/types";

interface TagBadgeProps {
  tag: Tag;
  onRemove?: () => void;
  className?: string;
  size?: "sm" | "default";
}

export function TagBadge({ tag, onRemove, className, size = "default" }: TagBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md font-medium ${size === "sm" ? "px-1 py-0 text-[9px]" : "px-1.5 py-0.5 text-[10px]"} ${className || ""}`}
      style={{
        backgroundColor: `${tag.color}18`,
        color: tag.color,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: tag.color }}
      />
      {tag.name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 hover:opacity-70"
        >
          ×
        </button>
      )}
    </span>
  );
}
