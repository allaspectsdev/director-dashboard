import type { Tag } from "@/types";

interface TagBadgeProps {
  tag: Tag;
  onRemove?: () => void;
  className?: string;
}

export function TagBadge({ tag, onRemove, className }: TagBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${className || ""}`}
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
