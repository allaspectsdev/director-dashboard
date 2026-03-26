"use client";

import { useState, useEffect } from "react";
import { getTags, createTag, addTagToEntity, removeTagFromEntity, getTagsForEntity } from "@/actions/tags";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TagBadge } from "./tag-badge";
import { Tags, Plus, Check } from "lucide-react";
import type { Tag } from "@/types";
import { toast } from "sonner";

const TAG_COLORS = [
  "#6366f1", "#ec4899", "#f97316", "#22c55e",
  "#06b6d4", "#8b5cf6", "#ef4444", "#eab308",
];

interface TagPickerProps {
  entityType: "task" | "project" | "conversation";
  entityId: number;
  initialTags?: Tag[];
}

export function TagPicker({ entityType, entityId, initialTags = [] }: TagPickerProps) {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(initialTags);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(TAG_COLORS[0]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      getTags().then(setAllTags);
    }
  }, [open]);

  async function handleToggleTag(tag: Tag) {
    const isSelected = selectedTags.some((t) => t.id === tag.id);
    if (isSelected) {
      await removeTagFromEntity(tag.id, entityType, entityId);
      setSelectedTags((prev) => prev.filter((t) => t.id !== tag.id));
    } else {
      await addTagToEntity(tag.id, entityType, entityId);
      setSelectedTags((prev) => [...prev, tag]);
    }
  }

  async function handleCreate() {
    if (!newName.trim()) return;
    try {
      const tag = await createTag(newName.trim(), newColor);
      await addTagToEntity(tag.id, entityType, entityId);
      setSelectedTags((prev) => [...prev, tag]);
      setAllTags((prev) => [...prev, tag]);
      setNewName("");
      setShowCreate(false);
      toast.success("Tag created");
    } catch {
      toast.error("Tag already exists");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      {selectedTags.map((tag) => (
        <TagBadge
          key={tag.id}
          tag={tag}
          onRemove={() => handleToggleTag(tag)}
        />
      ))}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button variant="ghost" size="icon" className="h-5 w-5" />
          }
        >
          <Tags className="h-3 w-3" />
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="start">
          <div className="space-y-1">
            {allTags.map((tag) => {
              const isSelected = selectedTags.some((t) => t.id === tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() => handleToggleTag(tag)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[12px] hover:bg-muted transition-colors"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="flex-1 text-left">{tag.name}</span>
                  {isSelected && (
                    <Check className="h-3 w-3 text-primary" />
                  )}
                </button>
              );
            })}

            {showCreate ? (
              <div className="space-y-2 border-t pt-2 mt-1">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Tag name"
                  className="h-7 text-[12px]"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
                <div className="flex gap-1">
                  {TAG_COLORS.map((c) => (
                    <button
                      key={c}
                      className={`h-4 w-4 rounded-full transition-all ${newColor === c ? "ring-2 ring-offset-1 ring-primary" : ""}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setNewColor(c)}
                    />
                  ))}
                </div>
                <div className="flex gap-1">
                  <Button size="sm" className="h-6 text-[11px] flex-1" onClick={handleCreate}>
                    Create
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 text-[11px]" onClick={() => setShowCreate(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowCreate(true)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[12px] text-muted-foreground hover:bg-muted transition-colors border-t mt-1 pt-1"
              >
                <Plus className="h-3 w-3" />
                Create tag
              </button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
