"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableItemProps {
  id: number;
  children: React.ReactNode;
  className?: string;
}

export function SortableItem({ id, children, className }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group/sortable relative",
        isDragging && "z-50 opacity-80 shadow-lg rounded-xl",
        className
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 flex h-6 w-5 items-center justify-center opacity-0 transition-opacity group-hover/sortable:opacity-40 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      {children}
    </div>
  );
}
