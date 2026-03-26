"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { RecurrenceRule } from "@/lib/recurrence";

const DAY_NAMES = ["S", "M", "T", "W", "T", "F", "S"];

interface RecurrencePickerProps {
  value: RecurrenceRule | null;
  onChange: (rule: RecurrenceRule | null) => void;
}

export function RecurrencePicker({ value, onChange }: RecurrencePickerProps) {
  const [enabled, setEnabled] = useState(!!value);

  function handleFrequencyChange(freq: string | null) {
    if (!freq || freq === "none") {
      setEnabled(false);
      onChange(null);
      return;
    }
    setEnabled(true);
    onChange({
      frequency: freq as RecurrenceRule["frequency"],
      interval: 1,
      daysOfWeek: freq === "weekly" ? [1] : undefined,
      dayOfMonth: freq === "monthly" ? new Date().getDate() : undefined,
    });
  }

  function toggleDay(day: number) {
    if (!value) return;
    const current = value.daysOfWeek || [];
    const newDays = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day].sort();
    onChange({ ...value, daysOfWeek: newDays.length > 0 ? newDays : [day] });
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label className="text-[12px]">Repeat</Label>
        <Select
          value={enabled ? value?.frequency || "none" : "none"}
          onValueChange={(v) => handleFrequencyChange(v)}
        >
          <SelectTrigger className="h-8 text-[12px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No repeat</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="custom">Custom interval</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {enabled && value && (
        <>
          {value.frequency === "weekly" && (
            <div className="space-y-2">
              <Label className="text-[12px]">Days</Label>
              <div className="flex gap-1">
                {DAY_NAMES.map((name, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleDay(i)}
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-md text-[11px] font-medium transition-colors",
                      value.daysOfWeek?.includes(i)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {value.frequency === "monthly" && (
            <div className="space-y-2">
              <Label className="text-[12px]">Day of month</Label>
              <Input
                type="number"
                min={1}
                max={31}
                value={value.dayOfMonth || 1}
                onChange={(e) =>
                  onChange({ ...value, dayOfMonth: Number(e.target.value) })
                }
                className="h-8 w-20 text-[12px]"
              />
            </div>
          )}

          {value.frequency === "custom" && (
            <div className="space-y-2">
              <Label className="text-[12px]">Every N days</Label>
              <Input
                type="number"
                min={1}
                value={value.interval}
                onChange={(e) =>
                  onChange({ ...value, interval: Number(e.target.value) || 1 })
                }
                className="h-8 w-20 text-[12px]"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
