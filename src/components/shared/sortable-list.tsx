"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

interface SortableListProps<T extends { id: number }> {
  items: T[];
  onReorder: (updates: { id: number; sortOrder: number }[]) => Promise<void>;
  children: (items: T[]) => React.ReactNode;
}

export function SortableList<T extends { id: number }>({
  items: initialItems,
  onReorder,
  children,
}: SortableListProps<T>) {
  const [items, setItems] = useState(initialItems);

  // Sync with server data when it changes
  if (initialItems !== items && initialItems.length !== items.length) {
    setItems(initialItems);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    const updates = newItems.map((item, index) => ({
      id: item.id,
      sortOrder: index,
    }));

    await onReorder(updates);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        {children(items)}
      </SortableContext>
    </DndContext>
  );
}
