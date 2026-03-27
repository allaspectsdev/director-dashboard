"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  name: string;
  value?: string;
  onChange?: (date: string | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({ name, value, onChange, placeholder = "Pick a date", className }: DatePickerProps) {
  const [open, setOpen] = useState(false);

  const selectedDate = value ? parseISO(value) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <input type="hidden" name={name} value={value || ""} />
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-9 text-[13px]",
              !value && "text-muted-foreground",
              className
            )}
          />
        }
      >
        <CalendarIcon className="mr-2 h-3.5 w-3.5" />
        {value ? format(parseISO(value), "MMM d, yyyy") : placeholder}
        {value && (
          <button
            type="button"
            className="ml-auto hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onChange?.(undefined);
            }}
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (date) {
              onChange?.(format(date, "yyyy-MM-dd"));
            } else {
              onChange?.(undefined);
            }
            setOpen(false);
          }}
          defaultMonth={selectedDate}
        />
      </PopoverContent>
    </Popover>
  );
}
