import { format, formatDistanceToNow, isPast, isToday, isTomorrow, parseISO } from "date-fns";

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const date = parseISO(dateStr);
  return format(date, "MMM d, yyyy");
}

export function formatDateShort(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const date = parseISO(dateStr);
  return format(date, "MMM d");
}

export function formatRelative(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const date = parseISO(dateStr);
  return formatDistanceToNow(date, { addSuffix: true });
}

export function isOverdue(dateStr: string | null | undefined): boolean {
  if (!dateStr) return false;
  const date = parseISO(dateStr);
  return isPast(date) && !isToday(date);
}

export function isDueToday(dateStr: string | null | undefined): boolean {
  if (!dateStr) return false;
  return isToday(parseISO(dateStr));
}

export function isDueTomorrow(dateStr: string | null | undefined): boolean {
  if (!dateStr) return false;
  return isTomorrow(parseISO(dateStr));
}

export function getDueDateLabel(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  if (isOverdue(dateStr)) return "Overdue";
  if (isDueToday(dateStr)) return "Today";
  if (isDueTomorrow(dateStr)) return "Tomorrow";
  return formatDateShort(dateStr);
}

export function toISODate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}
