import { addDays, addWeeks, addMonths, format, parseISO, nextDay } from "date-fns";

export interface RecurrenceRule {
  frequency: "daily" | "weekly" | "monthly" | "custom";
  interval: number;
  daysOfWeek?: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  dayOfMonth?: number;
}

export function getNextOccurrence(rule: RecurrenceRule, fromDate: string): string {
  const date = fromDate ? parseISO(fromDate) : new Date();

  switch (rule.frequency) {
    case "daily":
      return format(addDays(date, rule.interval), "yyyy-MM-dd");

    case "weekly":
      if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
        // Find the next matching day
        let next = addDays(date, 1);
        for (let i = 0; i < 14; i++) {
          if (rule.daysOfWeek.includes(next.getDay())) {
            return format(next, "yyyy-MM-dd");
          }
          next = addDays(next, 1);
        }
      }
      return format(addWeeks(date, rule.interval), "yyyy-MM-dd");

    case "monthly":
      const nextMonth = addMonths(date, rule.interval);
      if (rule.dayOfMonth) {
        const day = Math.min(rule.dayOfMonth, new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate());
        return format(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day), "yyyy-MM-dd");
      }
      return format(nextMonth, "yyyy-MM-dd");

    case "custom":
      return format(addDays(date, rule.interval), "yyyy-MM-dd");

    default:
      return format(addWeeks(date, 1), "yyyy-MM-dd");
  }
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function formatRecurrenceLabel(rule: RecurrenceRule): string {
  switch (rule.frequency) {
    case "daily":
      return rule.interval === 1 ? "Daily" : `Every ${rule.interval} days`;
    case "weekly":
      if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
        const days = rule.daysOfWeek.map((d) => DAY_NAMES[d]).join(", ");
        return `Weekly on ${days}`;
      }
      return rule.interval === 1 ? "Weekly" : `Every ${rule.interval} weeks`;
    case "monthly":
      if (rule.dayOfMonth) {
        return `Monthly on the ${rule.dayOfMonth}${getOrdinalSuffix(rule.dayOfMonth)}`;
      }
      return rule.interval === 1 ? "Monthly" : `Every ${rule.interval} months`;
    case "custom":
      return `Every ${rule.interval} days`;
    default:
      return "Recurring";
  }
}

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export function parseRecurrenceRule(json: string | null): RecurrenceRule | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as RecurrenceRule;
  } catch {
    return null;
  }
}
